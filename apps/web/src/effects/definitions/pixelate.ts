import type { EffectDefinition } from "@/effects/types";

export const PIXELATE_SHADER = "pixelate";

export const pixelateEffectDefinition: EffectDefinition = {
	type: "pixelate",
	name: "Pixelate",
	keywords: ["pixelate", "mosaic", "8bit", "retro", "blocky"],
	params: [
		{
			key: "blockSize",
			label: "Block Size",
			type: "number",
			default: 10,
			min: 2,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		passes: [
			{
				shader: PIXELATE_SHADER,
				uniforms: ({ effectParams, width, height }) => {
					const blockSize =
						typeof effectParams.blockSize === "number"
							? effectParams.blockSize
							: 10;
					
					return {
						u_block_size: blockSize,
						u_resolution: [width, height],
					};
				},
			},
		],
	},
};
