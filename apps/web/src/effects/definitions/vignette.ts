import type { EffectDefinition } from "@/effects/types";

export const VIGNETTE_SHADER = "vignette";

export const vignetteEffectDefinition: EffectDefinition = {
	type: "vignette",
	name: "Vignette",
	keywords: ["vignette", "dark edges", "border", "focus"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "roundness",
			label: "Roundness",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "smoothness",
			label: "Smoothness",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		passes: [
			{
				shader: VIGNETTE_SHADER,
				uniforms: ({ effectParams }) => {
					const intensity = typeof effectParams.intensity === "number" ? effectParams.intensity : 50;
					const roundness = typeof effectParams.roundness === "number" ? effectParams.roundness : 50;
					const smoothness = typeof effectParams.smoothness === "number" ? effectParams.smoothness : 50;
					
					return {
						u_intensity: intensity / 100,
						u_roundness: roundness / 100,
						u_smoothness: smoothness / 100,
					};
				},
			},
		],
	},
};
