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
    u_dip_to_color: vec4<f32>,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color1 = textureSample(t_diffuse1, s_diffuse1, in.uv);
    let color2 = textureSample(t_diffuse2, s_diffuse2, in.uv);
    
    // Check if dip_to_color has alpha > 0
    if (uniforms.u_dip_to_color.a > 0.0) {
        if (uniforms.u_progress < 0.5) {
            return mix(color1, uniforms.u_dip_to_color, uniforms.u_progress * 2.0);
        } else {
            return mix(uniforms.u_dip_to_color, color2, (uniforms.u_progress - 0.5) * 2.0);
        }
    }
    
    return mix(color1, color2, uniforms.u_progress);
}
