<script lang="ts">
	import { type Snippet } from 'svelte';
	import { StageContext, setStageContext } from './models.svelte';
	import { objectToStyle, sizeToStyleObject } from '../utils/style.svelte';
	import { classes } from '$lib/utils/classes';
	import type { Size } from '$lib/types';

	let {
		class: className,
		size,
		children,
		onStage
	} = $props<{
		class?: string;
		size?: Size;
		children?: Snippet;
		onStage?: (stage: StageContext) => void;
	}>();

	let stage = new StageContext({
		size: () => size
	});
	setStageContext(stage);
	onStage?.(stage);

	let style = $derived(objectToStyle(sizeToStyleObject(stage!.size)));
</script>

<div class={classes('stage', className)} {style}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.stage {
		background: #fff;
		position: relative;
	}
</style>
