@group(0) @binding(0) var t_diffuse: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_intensity: f32,
    u_direction: vec2<f32>,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let offset = uniforms.u_direction * uniforms.u_intensity;
    let r = textureSample(t_diffuse, s_diffuse, in.uv - offset).r;
    let g = textureSample(t_diffuse, s_diffuse, in.uv).g;
    let b = textureSample(t_diffuse, s_diffuse, in.uv + offset).b;
    let a = textureSample(t_diffuse, s_diffuse, in.uv).a;
    return vec4<f32>(r, g, b, a);
}
