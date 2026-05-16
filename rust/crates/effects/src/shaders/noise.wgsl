@group(0) @binding(0) var t_diffuse: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_intensity: f32,
    u_speed: f32,
    u_monochrome: f32,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

fn random(st: vec2<f32>) -> f32 {
    return fract(sin(dot(st.xy, vec2<f32>(12.9898,78.233))) * 43758.5453123);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(t_diffuse, s_diffuse, in.uv);
    // Simple noise generator
    let n = (random(in.uv) - 0.5) * uniforms.u_intensity;
    
    var final_color = color.rgb;
    if (uniforms.u_monochrome > 0.5) {
        final_color = color.rgb + vec3<f32>(n);
    } else {
        let nr = (random(in.uv + vec2<f32>(0.1, 0.0)) - 0.5) * uniforms.u_intensity;
        let ng = (random(in.uv + vec2<f32>(0.0, 0.1)) - 0.5) * uniforms.u_intensity;
        let nb = (random(in.uv + vec2<f32>(0.1, 0.1)) - 0.5) * uniforms.u_intensity;
        final_color = color.rgb + vec3<f32>(nr, ng, nb);
    }
    
    return vec4<f32>(final_color, color.a);
}
