import { effectsRegistry } from "../registry";
import { blurEffectDefinition } from "./blur";
import { chromaticAberrationEffectDefinition } from "./chromatic-aberration";
import { pixelateEffectDefinition } from "./pixelate";
import { glitchEffectDefinition } from "./glitch";
import { noiseEffectDefinition } from "./noise";
import { vignetteEffectDefinition } from "./vignette";

const defaultEffects = [
	blurEffectDefinition,
	chromaticAberrationEffectDefinition,
	pixelateEffectDefinition,
	glitchEffectDefinition,
	noiseEffectDefinition,
	vignetteEffectDefinition,
];

export function registerDefaultEffects(): void {
	for (const definition of defaultEffects) {
		if (effectsRegistry.has(definition.type)) {
			continue;
		}
		effectsRegistry.register({
			key: definition.type,
			definition,
		});
	}
}
