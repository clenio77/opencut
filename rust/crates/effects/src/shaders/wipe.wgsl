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
    u_direction: vec2<f32>,
    u_softness: f32,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let p = uniforms.u_progress;
    
    // Wipe uses dot product to find position along the direction vector
    let dir = normalize(uniforms.u_direction);
    let center = vec2<f32>(0.5);
    
    // Position of current pixel relative to center, projected on direction
    let pos = dot(in.uv - center, dir) + 0.5;
    
    let color1 = textureSample(t_diffuse1, s_diffuse1, in.uv);
    let color2 = textureSample(t_diffuse2, s_diffuse2, in.uv);
    
    // Apply softness
    let soft = max(uniforms.u_softness, 0.001);
    let m = smoothstep(p - soft, p + soft, pos);
    
    // If we're wiping left-to-right (dir = (1, 0)), 
    // when p = 0, pos > p is true everywhere, so m = 1.0 (shows color1)
    // when p = 1, pos > p is false everywhere, so m = 0.0 (shows color2)
    return mix(color2, color1, m);
}
