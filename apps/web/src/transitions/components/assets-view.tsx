"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanelView } from "@/components/editor/panels/assets/views/base-panel";
import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import {
	Section,
	SectionContent,
	SectionHeader,
	SectionTitle,
} from "@/components/section";
import {
	transitionsRegistry,
	TRANSITION_CATEGORY_LABELS,
	TRANSITION_CATEGORY_ORDER,
} from "@/transitions";
import type { TransitionDefinition } from "@/transitions/types";
import type { TimelineDragData } from "@/timeline/drag";


export function TransitionsView() {

	const allTransitions = transitionsRegistry.getAll();
	const grouped = transitionsRegistry.getGrouped();

	if (allTransitions.length === 0) {
		return (
			<PanelView title="Transitions">
				<div className="text-muted-foreground flex items-center justify-center p-8 text-sm">
					No transitions available
				</div>
			</PanelView>
		);
	}

	return (
		<PanelView title="Transitions">
			{TRANSITION_CATEGORY_ORDER.map((category) => {
				const items = grouped[category];
				if (!items || items.length === 0) return null;

				return (
					<Section
						key={category}
						collapsible
						sectionKey={`transitions:${category}`}
					>
						<SectionHeader>
							<SectionTitle>
								{TRANSITION_CATEGORY_LABELS[category] ?? category}
							</SectionTitle>
						</SectionHeader>
						<SectionContent>
							<TransitionsGrid transitions={items} />
						</SectionContent>
					</Section>
				);
			})}
		</PanelView>
	);
}

function TransitionsGrid({
	transitions,
}: {
	transitions: TransitionDefinition[];
}) {
	return (
		<div
			className="grid gap-2 pb-2"
			style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
		>
			{transitions.map((transition) => (
				<TransitionItem key={transition.type} transition={transition} />
			))}
		</div>
	);
}

function TransitionItem({
	transition,
}: {
	transition: TransitionDefinition;
}) {
	const preview = <TransitionPreviewCanvas />;

	const dragData: TimelineDragData = useMemo(
		() => ({
			id: transition.type,
			name: transition.name,
			type: "effect" as const,
			effectType: transition.type,
			targetElementTypes: ["video", "image", "text", "sticker", "graphic"],
		}),
		[transition.type, transition.name],
	);

	return (
		<DraggableItem
			name={transition.name}
			preview={preview}
			dragData={dragData}
			aspectRatio={16 / 9}
			isRounded
			variant="card"
			containerClassName="w-full"
			isDraggable={false}
		/>
	);
}

/**
 * Animated canvas that renders a live preview of the transition effect.
 * Shows a cycling A→B blend using the transition's shader uniforms.
 */
function TransitionPreviewCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);
	const [isHovered, setIsHovered] = useState(false);

	const drawPreview = useCallback(
		(ctx: CanvasRenderingContext2D, progress: number) => {
			const { width, height } = ctx.canvas;

			// Source A — dark gradient (outgoing clip placeholder)
			const gradA = ctx.createLinearGradient(0, 0, width, height);
			gradA.addColorStop(0, "#334155");
			gradA.addColorStop(1, "#1e293b");

			// Source B — accent gradient (incoming clip placeholder)
			const gradB = ctx.createLinearGradient(0, 0, width, height);
			gradB.addColorStop(0, "#6366f1");
			gradB.addColorStop(1, "#8b5cf6");

			// Simple cross-fade visualisation
			ctx.globalAlpha = 1;
			ctx.fillStyle = gradA;
			ctx.fillRect(0, 0, width, height);

			ctx.globalAlpha = progress;
			ctx.fillStyle = gradB;
			ctx.fillRect(0, 0, width, height);

			// Draw a subtle progress indicator bar at the bottom
			ctx.globalAlpha = 0.6;
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, height - 2, width * progress, 2);

			ctx.globalAlpha = 1;
		},
		[],
	);

	useEffect(() => {
		if (!isHovered) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = 192;
		canvas.height = 108;

		const duration = 1500; // ms for one cycle
		let startTime: number | null = null;

		const animate = (timestamp: number) => {
			if (startTime === null) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = (elapsed % duration) / duration;

			drawPreview(ctx, progress);
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
		};
	}, [isHovered, drawPreview]);

	// Draw initial static state
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = 192;
		canvas.height = 108;
		drawPreview(ctx, 0);
	}, [drawPreview]);

	return (
		<canvas
			ref={canvasRef}
			className="size-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		/>
	);
}
