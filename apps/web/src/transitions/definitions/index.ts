import { transitionsRegistry } from "../registry";
import {
	fadeTransitionDefinition,
	fadeToBlackTransitionDefinition,
	slideLeftTransitionDefinition,
	slideRightTransitionDefinition,
	slideUpTransitionDefinition,
	slideDownTransitionDefinition,
	wipeTransitionDefinition,
	zoomInTransitionDefinition,
	zoomOutTransitionDefinition,
} from "./transitions";

const defaultTransitions = [
	fadeTransitionDefinition,
	fadeToBlackTransitionDefinition,
	slideLeftTransitionDefinition,
	slideRightTransitionDefinition,
	slideUpTransitionDefinition,
	slideDownTransitionDefinition,
	wipeTransitionDefinition,
	zoomInTransitionDefinition,
	zoomOutTransitionDefinition,
];

export function registerDefaultTransitions(): void {
	for (const definition of defaultTransitions) {
		if (transitionsRegistry.has(definition.type)) {
			continue;
		}
		transitionsRegistry.register({
			key: definition.type,
			definition,
		});
	}
}
