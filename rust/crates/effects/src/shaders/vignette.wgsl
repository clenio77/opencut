@group(0) @binding(0) var t_diffuse: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_intensity: f32,
    u_roundness: f32,
    u_smoothness: f32,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(t_diffuse, s_diffuse, in.uv);
    
    // Convert uv (0 to 1) to coordinate (-1 to 1)
    let coord = (in.uv - 0.5) * 2.0;
    
    // Calculate distance with roundness adjustment
    // roundness = 1.0 means perfect circle, roundness = 0.0 means perfect square
    let r = mix(max(abs(coord.x), abs(coord.y)), length(coord), uniforms.u_roundness);
    
    // Calculate vignette falloff
    let falloff = smoothstep(1.0 - uniforms.u_intensity, 1.0 - uniforms.u_intensity + uniforms.u_smoothness, r);
    
    return vec4<f32>(color.rgb * (1.0 - falloff), color.a);
}
