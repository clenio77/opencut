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
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let p = uniforms.u_progress;
    let offset1 = uniforms.u_direction * p;
    let offset2 = uniforms.u_direction * (p - 1.0);
    
    let uv1 = in.uv + offset1;
    let uv2 = in.uv + offset2;
    
    if (uv2.x >= 0.0 && uv2.x <= 1.0 && uv2.y >= 0.0 && uv2.y <= 1.0) {
        return textureSample(t_diffuse2, s_diffuse2, uv2);
    }
    
    if (uv1.x >= 0.0 && uv1.x <= 1.0 && uv1.y >= 0.0 && uv1.y <= 1.0) {
        return textureSample(t_diffuse1, s_diffuse1, uv1);
    }
    
    return vec4<f32>(0.0);
}
