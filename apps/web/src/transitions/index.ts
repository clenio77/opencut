import { generateUUID } from "@/utils/id";
import { buildDefaultParamValues } from "@/params/registry";
import { transitionsRegistry } from "./registry";
import type { ParamValues } from "@/params";
import type {
	TransitionDefinition,
	TransitionInstance,
} from "@/transitions/types";
import type { MediaTime } from "@/wasm";

export { transitionsRegistry } from "./registry";
export { registerDefaultTransitions } from "./definitions";

/**
 * Creates a new instance of a transition with default parameter values.
 */
export function buildDefaultTransitionInstance({
	transitionType,
	durationOverride,
}: {
	transitionType: string;
	durationOverride?: MediaTime;
}): TransitionInstance {
	const definition = transitionsRegistry.get(transitionType);
	const params: ParamValues = buildDefaultParamValues(definition.params);

	return {
		id: generateUUID(),
		type: transitionType,
		duration: durationOverride ?? definition.defaultDuration,
		params,
	};
}

/**
 * Returns all transition definitions grouped by category for
 * the assets panel view.
 */
export function getTransitionsGrouped(): Record<string, TransitionDefinition[]> {
	return transitionsRegistry.getGrouped();
}

/**
 * Category display names, in the order they should appear in the UI.
 */
export const TRANSITION_CATEGORY_LABELS: Record<string, string> = {
	basic: "Basic",
	slide: "Slide",
	zoom: "Zoom",
	stylized: "Stylized",
};

export const TRANSITION_CATEGORY_ORDER = [
	"basic",
	"slide",
	"zoom",
	"stylized",
] as const;
