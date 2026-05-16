@group(0) @binding(0) var t_diffuse: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_intensity: f32,
    u_speed: f32,
    u_block_size: f32,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

fn random(st: vec2<f32>) -> f32 {
    return fract(sin(dot(st.xy, vec2<f32>(12.9898,78.233))) * 43758.5453123);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Placeholder simple glitch implementation using random 
    // Usually uses time but we're skipping that for now based on the previous edit
    let noise = random(vec2<f32>(floor(in.uv.y * uniforms.u_block_size), 0.0));
    var offset = 0.0;
    if (noise > 0.9) {
        offset = uniforms.u_intensity * 0.1;
    } else if (noise < 0.1) {
        offset = -uniforms.u_intensity * 0.1;
    }
    
    let r = textureSample(t_diffuse, s_diffuse, vec2<f32>(in.uv.x + offset, in.uv.y)).r;
    let g = textureSample(t_diffuse, s_diffuse, in.uv).g;
    let b = textureSample(t_diffuse, s_diffuse, vec2<f32>(in.uv.x - offset, in.uv.y)).b;
    let a = textureSample(t_diffuse, s_diffuse, in.uv).a;
    return vec4<f32>(r, g, b, a);
}
