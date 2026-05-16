import type { ParamDefinition, ParamValues } from "@/params";
import type { MediaTime } from "@/wasm";

/**
 * Categories used to group transitions in the assets panel.
 */
export type TransitionCategory = "basic" | "slide" | "zoom" | "stylized";

/**
 * Describes how a single transition renders its progress frame.
 * The renderer mixes the outgoing clip (source A) with the incoming clip
 * (source B) using a shader program driven by a normalised progress value.
 */
export interface TransitionRendererConfig {
	shader: string;
	uniforms(params: {
		transitionParams: ParamValues;
		progress: number; // 0..1
		width: number;
		height: number;
	}): Record<string, number | number[]>;
}

/**
 * Static definition of a transition type (e.g. "fade", "slide-left").
 * Registered once at startup via the transitions registry.
 */
export interface TransitionDefinition {
	type: string;
	name: string;
	keywords: string[];
	category: TransitionCategory;
	defaultDuration: MediaTime;
	params: ParamDefinition[];
	renderer: TransitionRendererConfig;
}

/**
 * A concrete instance of a transition placed between two timeline elements.
 */
export interface TransitionInstance {
	id: string;
	type: string;
	duration: MediaTime;
	params: ParamValues;
}
