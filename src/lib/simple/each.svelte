<script lang="ts" generics="T">
	import {
		EachContext,
		getRenderContext,
		getStageContext,
		setRenderContext
	} from './context.svelte';
	import type { Snippet } from 'svelte';

	let { models, item } = $props<{
		name?: string;
		models: T[];
		item: Snippet<[T]>;
	}>();

	let stage = getStageContext();
	let parent = getRenderContext();
	let context = new EachContext<T>({
		stage,
		parent,
		model: () => models,
		draw: () => () => {}
	});
	setRenderContext(context);
</script>

{#each models as model (model)}
	{@render item(model)}
{/each}
