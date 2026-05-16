"use client";

import { useCallback, useState } from "react";
import { PanelView } from "@/components/editor/panels/assets/views/base-panel";
import {
	Section,
	SectionContent,
	SectionHeader,
	SectionTitle,
} from "@/components/section";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/ui";
import {
	ADJUSTMENT_GROUPS,
	getAdjustmentsByGroup,
	type AdjustmentParamDefinition,
} from "@/adjustment";
import { useEditor } from "@/editor/use-editor";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons";

export function AdjustmentView() {
	return (
		<PanelView title="Adjustment">
			{ADJUSTMENT_GROUPS.map((group) => (
				<AdjustmentGroup
					key={group.key}
					groupKey={group.key}
					label={group.label}
				/>
			))}
		</PanelView>
	);
}

function AdjustmentGroup({
	groupKey,
	label,
}: {
	groupKey: string;
	label: string;
}) {
	const params = getAdjustmentsByGroup(groupKey);

	if (params.length === 0) return null;

	return (
		<Section collapsible sectionKey={`adjustment:${groupKey}`}>
			<SectionHeader>
				<SectionTitle>{label}</SectionTitle>
			</SectionHeader>
			<SectionContent className="flex flex-col gap-1 pb-3">
				{params.map((param) => (
					<AdjustmentSlider key={param.key} definition={param} />
				))}
			</SectionContent>
		</Section>
	);
}

function AdjustmentSlider({
	definition,
}: {
	definition: AdjustmentParamDefinition;
}) {
	const editor = useEditor();
	const [localValue, setLocalValue] = useState(definition.default);
	const isDefault = localValue === definition.default;

	const applyToSelectedElements = useCallback(
		(value: number) => {
			const selected = editor.selection.getSelectedElements();
			if (selected.length === 0) return;

			editor.timeline.updateElements({
				updates: selected.map((ref) => ({
					trackId: ref.trackId,
					elementId: ref.elementId,
					patch: {
						params: {
							[`adjustment.${definition.key}`]: value,
						},
					} as Partial<import("@/timeline").TimelineElement>,
				})),
				pushHistory: false,
			});
		},
		[editor, definition.key],
	);

	const handleValueChange = useCallback(
		(values: number[]) => {
			const newValue = values[0] ?? definition.default;
			setLocalValue(newValue);
			applyToSelectedElements(newValue);
		},
		[definition.default, applyToSelectedElements],
	);

	const handleValueCommit = useCallback(
		(values: number[]) => {
			const newValue = values[0] ?? definition.default;
			setLocalValue(newValue);

			const selected = editor.selection.getSelectedElements();
			if (selected.length === 0) return;

			editor.timeline.updateElements({
				updates: selected.map((ref) => ({
					trackId: ref.trackId,
					elementId: ref.elementId,
					patch: {
						params: {
							[`adjustment.${definition.key}`]: newValue,
						},
					} as Partial<import("@/timeline").TimelineElement>,
				})),
				pushHistory: true,
			});
		},
		[editor, definition.key, definition.default],
	);

	const handleReset = useCallback(() => {
		setLocalValue(definition.default);
		applyToSelectedElements(definition.default);
	}, [definition.default, applyToSelectedElements]);

	/** Map stored value to a display percentage for bipolar sliders. */
	const displayValue =
		definition.min < 0
			? localValue // bipolar: show as-is (-100..100)
			: localValue; // unipolar: show as-is (0..100)

	return (
		<div className="group flex flex-col gap-1 px-2">
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-xs select-none">
					{definition.label}
				</span>
				<div className="flex items-center gap-1">
					<span
						className={cn(
							"text-xs tabular-nums min-w-[2.5rem] text-right",
							isDefault ? "text-muted-foreground/50" : "text-foreground",
						)}
					>
						{localValue > 0 && definition.min < 0 ? "+" : ""}
						{localValue}
					</span>
					{!isDefault && (
						<Button
							variant="text"
							size="text"
							className="opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label={`Reset ${definition.label} to default`}
							onClick={handleReset}
						>
							<HugeiconsIcon
								icon={ArrowTurnBackwardIcon}
								className="size-3!"
							/>
						</Button>
					)}
				</div>
			</div>
			<Slider
				min={definition.min}
				max={definition.max}
				step={definition.step}
				value={[localValue]}
				onValueChange={handleValueChange}
				onValueCommit={handleValueCommit}
				aria-label={definition.label}
			/>
		</div>
	);
}
