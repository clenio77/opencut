import type { EffectDefinition } from "@/effects/types";

export const GLITCH_SHADER = "glitch";

export const glitchEffectDefinition: EffectDefinition = {
	type: "glitch",
	name: "Glitch",
	keywords: ["glitch", "distortion", "digital", "error", "vhs"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 20,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "speed",
			label: "Speed",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "blockSize",
			label: "Block Size",
			type: "number",
			default: 10,
			min: 1,
			max: 50,
			step: 1,
		},
	],
	renderer: {
		passes: [
			{
				shader: GLITCH_SHADER,
				uniforms: ({ effectParams }) => {
					const intensity = typeof effectParams.intensity === "number" ? effectParams.intensity : 20;
					const speed = typeof effectParams.speed === "number" ? effectParams.speed : 50;
					const blockSize = typeof effectParams.blockSize === "number" ? effectParams.blockSize : 10;
					
					return {
						u_intensity: intensity / 100,
						u_speed: speed / 100,
						u_block_size: blockSize,
					};
				},
			},
		],
	},
};
