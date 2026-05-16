import type {
	AdjustmentParamDefinition,
	AdjustmentGroupInfo,
	AdjustmentValues,
} from "./types";

// ── Group metadata ────────────────────────────────────────────────────

export const ADJUSTMENT_GROUPS: AdjustmentGroupInfo[] = [
	{ key: "light", label: "Light" },
	{ key: "color", label: "Color" },
	{ key: "detail", label: "Detail" },
];

// ── Parameter definitions ─────────────────────────────────────────────

export const adjustmentDefinitions: AdjustmentParamDefinition[] = [
	// ─── Light ─────────────────────────────────────────────
	{
		key: "brightness",
		label: "Brightness",
		group: "light",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "contrast",
		label: "Contrast",
		group: "light",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "exposure",
		label: "Exposure",
		group: "light",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "highlights",
		label: "Highlights",
		group: "light",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "shadows",
		label: "Shadows",
		group: "light",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},

	// ─── Color ─────────────────────────────────────────────
	{
		key: "saturation",
		label: "Saturation",
		group: "color",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "temperature",
		label: "Temperature",
		group: "color",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "tint",
		label: "Tint",
		group: "color",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "vibrance",
		label: "Vibrance",
		group: "color",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},

	// ─── Detail ────────────────────────────────────────────
	{
		key: "sharpen",
		label: "Sharpen",
		group: "detail",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "vignette",
		label: "Vignette",
		group: "detail",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "grain",
		label: "Grain",
		group: "detail",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		key: "fade",
		label: "Fade",
		group: "detail",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
];

// ── Helpers ───────────────────────────────────────────────────────────

/**
 * Returns definitions filtered by group, in definition order.
 */
export function getAdjustmentsByGroup(
	group: string,
): AdjustmentParamDefinition[] {
	return adjustmentDefinitions.filter((d) => d.group === group);
}

/**
 * Creates a default values map with all adjustments set to their defaults.
 */
export function buildDefaultAdjustmentValues(): AdjustmentValues {
	const values: AdjustmentValues = {};
	for (const def of adjustmentDefinitions) {
		values[def.key] = def.default;
	}
	return values;
}

/**
 * Returns true if any adjustment value differs from its default.
 */
export function hasNonDefaultAdjustments(
	values: AdjustmentValues,
): boolean {
	return adjustmentDefinitions.some((def) => {
		const current = values[def.key];
		return current !== undefined && current !== def.default;
	});
}
