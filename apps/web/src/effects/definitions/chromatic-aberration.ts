import type { EffectDefinition } from "@/effects/types";

export const CHROMATIC_ABERRATION_SHADER = "chromatic-aberration";

export const chromaticAberrationEffectDefinition: EffectDefinition = {
	type: "chromatic-aberration",
	name: "Chromatic Aberration",
	keywords: ["chromatic", "aberration", "glitch", "rgb", "split"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 10,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "angle",
			label: "Angle",
			type: "number",
			default: 0,
			min: 0,
			max: 360,
			step: 1,
		},
	],
	renderer: {
		passes: [
			{
				shader: CHROMATIC_ABERRATION_SHADER,
				uniforms: ({ effectParams }) => {
					const intensity =
						typeof effectParams.intensity === "number"
							? effectParams.intensity
							: 10;
					const angle =
						typeof effectParams.angle === "number" ? effectParams.angle : 0;
					
					// Convert angle to radians and calculate direction vector
					const rad = (angle * Math.PI) / 180;
					return {
						u_intensity: intensity / 100, // Normalize to 0..1
						u_direction: [Math.cos(rad), Math.sin(rad)],
					};
				},
			},
		],
	},
};
