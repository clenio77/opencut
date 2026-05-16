import type { ParamDefinition } from "@/params";

/**
 * Groups used to organise adjustment controls in the assets panel.
 */
export type AdjustmentGroup = "light" | "color" | "detail";

/**
 * A single adjustment parameter definition. Extends the base param
 * system with an explicit group for the UI layout.
 */
export interface AdjustmentParamDefinition {
	key: string;
	label: string;
	group: AdjustmentGroup;
	min: number;
	max: number;
	step: number;
	default: number;
	/** Short unit label shown next to the value (e.g. "%", "°"). */
	unit?: string;
}

/**
 * Group metadata for the adjustment panel UI.
 */
export interface AdjustmentGroupInfo {
	key: AdjustmentGroup;
	label: string;
}

/**
 * Stored adjustment values — a flat map from param key to current value.
 */
export type AdjustmentValues = Record<string, number>;

/**
 * Converts an AdjustmentParamDefinition to a standard ParamDefinition
 * so it can integrate with the existing param system.
 */
export function toParamDefinition(
	adjustment: AdjustmentParamDefinition,
): ParamDefinition {
	return {
		key: `adjustment.${adjustment.key}`,
		label: adjustment.label,
		type: "number",
		default: adjustment.default,
		min: adjustment.min,
		max: adjustment.max,
		step: adjustment.step,
	};
}
