@group(0) @binding(0) var t_diffuse: texture_2d<f32>;
@group(0) @binding(1) var s_diffuse: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

struct Uniforms {
    u_block_size: f32,
    u_resolution: vec2<f32>,
}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let size = uniforms.u_block_size;
    let dx = size / uniforms.u_resolution.x;
    let dy = size / uniforms.u_resolution.y;
    let coord = vec2<f32>(
        dx * floor(in.uv.x / dx) + (dx / 2.0),
        dy * floor(in.uv.y / dy) + (dy / 2.0)
    );
    return textureSample(t_diffuse, s_diffuse, coord);
}
