import type { EffectDefinition } from "@/effects/types";

export const NOISE_SHADER = "noise";

export const noiseEffectDefinition: EffectDefinition = {
	type: "noise",
	name: "Noise",
	keywords: ["noise", "film grain", "static", "tv"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 15,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "speed",
			label: "Speed",
			type: "number",
			default: 100,
			min: 0,
			max: 200,
			step: 1,
		},
		{
			key: "monochrome",
			label: "Monochrome",
			type: "boolean",
			default: true,
		},
	],
	renderer: {
		passes: [
			{
				shader: NOISE_SHADER,
				uniforms: ({ effectParams }) => {
					const intensity = typeof effectParams.intensity === "number" ? effectParams.intensity : 15;
					const speed = typeof effectParams.speed === "number" ? effectParams.speed : 100;
					const monochrome = typeof effectParams.monochrome === "boolean" ? effectParams.monochrome : true;
					
					return {
						u_intensity: intensity / 100,
						u_speed: speed / 100,
						u_monochrome: monochrome ? 1 : 0,
					};
				},
			},
		],
	},
};
