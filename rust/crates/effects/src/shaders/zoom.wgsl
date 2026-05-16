@group(0) @binding(0) var t_diffuse1: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse1: sampler;
@group(0) @binding(2) var t_diffuse2: texture_2d<f32>;
@group(0) @binding(3) var s_diffuse2: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_progress: f32,
    u_direction: f32, // 1 for zoom in, -1 for zoom out
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let p = uniforms.u_progress;
    let dir = uniforms.u_direction;
    
    let center = vec2<f32>(0.5);
    let diff = in.uv - center;
    
    var scale1 = 1.0;
    var scale2 = 1.0;
    
    if (dir > 0.0) {
        // Zoom IN: Image 1 gets bigger (scale decreases), Image 2 starts big and becomes normal
        scale1 = 1.0 - (p * 0.5);
        scale2 = 1.5 - (p * 0.5);
    } else {
        // Zoom OUT: Image 1 gets smaller (scale increases), Image 2 starts small and becomes normal
        scale1 = 1.0 + (p * 0.5);
        scale2 = 0.5 + (p * 0.5);
    }
    
    let uv1 = center + (diff / scale1);
    let uv2 = center + (diff / scale2);
    
    let color1 = textureSample(t_diffuse1, s_diffuse1, uv1);
    let color2 = textureSample(t_diffuse2, s_diffuse2, uv2);
    
    // Fade out color 1 as it gets closer to boundaries, or just alpha mix
    return mix(color1, color2, p);
}
