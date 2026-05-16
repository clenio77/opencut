import { DefinitionRegistry } from "@/params/registry";
import type { TransitionDefinition } from "@/transitions/types";

export class TransitionsRegistry extends DefinitionRegistry<
	string,
	TransitionDefinition
> {
	constructor() {
		super("transition");
	}

	/**
	 * Returns all definitions grouped by category, preserving insertion order
	 * within each group.
	 */
	getGrouped(): Record<string, TransitionDefinition[]> {
		const all = this.getAll();
		const groups: Record<string, TransitionDefinition[]> = {};
		for (const definition of all) {
			const key = definition.category;
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(definition);
		}
		return groups;
	}
}

export const transitionsRegistry = new TransitionsRegistry();
