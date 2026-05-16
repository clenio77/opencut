import type { TransitionDefinition } from "@/transitions/types";
import { mediaTime } from "@/wasm";

/** Default transition duration in media-time ticks (≈ 0.5 seconds at 30fps). */
const DEFAULT_DURATION = mediaTime({ ticks: 15000 });
/** Shorter default for quick transitions. */
const SHORT_DURATION = mediaTime({ ticks: 10000 });

export const TRANSITION_CROSS_DISSOLVE_SHADER = "cross-dissolve";
export const TRANSITION_SLIDE_SHADER = "slide";
export const TRANSITION_WIPE_SHADER = "wipe";
export const TRANSITION_ZOOM_SHADER = "zoom";

// ── Fade (Cross-Dissolve) ─────────────────────────────────────────────

export const fadeTransitionDefinition: TransitionDefinition = {
	type: "fade",
	name: "Fade",
	keywords: ["fade", "dissolve", "cross", "blend"],
	category: "basic",
	defaultDuration: DEFAULT_DURATION,
	params: [
		{
			key: "easing",
			label: "Easing",
			type: "select",
			default: "linear",
			options: [
				{ value: "linear", label: "Linear" },
				{ value: "ease-in", label: "Ease In" },
				{ value: "ease-out", label: "Ease Out" },
				{ value: "ease-in-out", label: "Ease In Out" },
			],
		},
	],
	renderer: {
		shader: TRANSITION_CROSS_DISSOLVE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
		}),
	},
};

// ── Fade to Black ─────────────────────────────────────────────────────

export const fadeToBlackTransitionDefinition: TransitionDefinition = {
	type: "fade-to-black",
	name: "Fade to Black",
	keywords: ["fade", "black", "dip", "dark"],
	category: "basic",
	defaultDuration: DEFAULT_DURATION,
	params: [],
	renderer: {
		shader: TRANSITION_CROSS_DISSOLVE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
			u_dip_to_color: [0, 0, 0, 1],
		}),
	},
};

// ── Slide Left ────────────────────────────────────────────────────────

export const slideLeftTransitionDefinition: TransitionDefinition = {
	type: "slide-left",
	name: "Slide Left",
	keywords: ["slide", "push", "left", "horizontal"],
	category: "slide",
	defaultDuration: DEFAULT_DURATION,
	params: [],
	renderer: {
		shader: TRANSITION_SLIDE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
			u_direction: [-1, 0],
		}),
	},
};

// ── Slide Right ───────────────────────────────────────────────────────

export const slideRightTransitionDefinition: TransitionDefinition = {
	type: "slide-right",
	name: "Slide Right",
	keywords: ["slide", "push", "right", "horizontal"],
	category: "slide",
	defaultDuration: DEFAULT_DURATION,
	params: [],
	renderer: {
		shader: TRANSITION_SLIDE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
			u_direction: [1, 0],
		}),
	},
};

// ── Slide Up ──────────────────────────────────────────────────────────

export const slideUpTransitionDefinition: TransitionDefinition = {
	type: "slide-up",
	name: "Slide Up",
	keywords: ["slide", "push", "up", "vertical"],
	category: "slide",
	defaultDuration: DEFAULT_DURATION,
	params: [],
	renderer: {
		shader: TRANSITION_SLIDE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
			u_direction: [0, -1],
		}),
	},
};

// ── Slide Down ────────────────────────────────────────────────────────

export const slideDownTransitionDefinition: TransitionDefinition = {
	type: "slide-down",
	name: "Slide Down",
	keywords: ["slide", "push", "down", "vertical"],
	category: "slide",
	defaultDuration: DEFAULT_DURATION,
	params: [],
	renderer: {
		shader: TRANSITION_SLIDE_SHADER,
		uniforms: ({ progress }) => ({
			u_progress: progress,
			u_direction: [0, 1],
		}),
	},
};

// ── Wipe ──────────────────────────────────────────────────────────────

export const wipeTransitionDefinition: TransitionDefinition = {
	type: "wipe",
	name: "Wipe",
	keywords: ["wipe", "curtain", "reveal"],
	category: "stylized",
	defaultDuration: DEFAULT_DURATION,
	params: [
		{
			key: "angle",
			label: "Angle",
			type: "number",
			default: 0,
			min: 0,
			max: 360,
			step: 1,
		},
		{
			key: "softness",
			label: "Softness",
			type: "number",
			default: 0.05,
			min: 0,
			max: 0.5,
			step: 0.01,
		},
	],
	renderer: {
		shader: TRANSITION_WIPE_SHADER,
		uniforms: ({ transitionParams, progress }) => {
			const angle =
				typeof transitionParams.angle === "number"
					? transitionParams.angle
					: 0;
			const softness =
				typeof transitionParams.softness === "number"
					? transitionParams.softness
					: 0.05;
			const rad = (angle * Math.PI) / 180;
			return {
				u_progress: progress,
				u_direction: [Math.cos(rad), Math.sin(rad)],
				u_softness: softness,
			};
		},
	},
};

// ── Zoom In ───────────────────────────────────────────────────────────

export const zoomInTransitionDefinition: TransitionDefinition = {
	type: "zoom-in",
	name: "Zoom In",
	keywords: ["zoom", "scale", "in", "grow"],
	category: "zoom",
	defaultDuration: SHORT_DURATION,
	params: [
		{
			key: "maxScale",
			label: "Max Scale",
			type: "number",
			default: 1.5,
			min: 1.01,
			max: 5,
			step: 0.01,
		},
	],
	renderer: {
		shader: TRANSITION_ZOOM_SHADER,
		uniforms: ({ transitionParams, progress }) => {
			const maxScale =
				typeof transitionParams.maxScale === "number"
					? transitionParams.maxScale
					: 1.5;
			return {
				u_progress: progress,
				u_scale: 1 + (maxScale - 1) * progress,
				u_mode: 0, // 0 = zoom in (outgoing scales up)
			};
		},
	},
};

// ── Zoom Out ──────────────────────────────────────────────────────────

export const zoomOutTransitionDefinition: TransitionDefinition = {
	type: "zoom-out",
	name: "Zoom Out",
	keywords: ["zoom", "scale", "out", "shrink"],
	category: "zoom",
	defaultDuration: SHORT_DURATION,
	params: [
		{
			key: "minScale",
			label: "Min Scale",
			type: "number",
			default: 0.5,
			min: 0.01,
			max: 0.99,
			step: 0.01,
		},
	],
	renderer: {
		shader: TRANSITION_ZOOM_SHADER,
		uniforms: ({ transitionParams, progress }) => {
			const minScale =
				typeof transitionParams.minScale === "number"
					? transitionParams.minScale
					: 0.5;
			return {
				u_progress: progress,
				u_scale: 1 - (1 - minScale) * progress,
				u_mode: 1, // 1 = zoom out (outgoing scales down)
			};
		},
	},
};
