<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		LayerContext,
		getStageContext,
		setLayerContext,
		setRenderContext
	} from './models.svelte';

	let { children } = $props<{
		children?: Snippet;
	}>();

	let stage = getStageContext();
	let layer = new LayerContext(stage);
	stage.registerLayer(layer);
	setLayerContext(layer);
	setRenderContext(layer.render);

	$effect(() => {
		return () => {
			stage.unregisterLayer(layer!);
		};
	});
</script>

<canvas bind:this={layer!.render.element} class="layer">
	{#if children}
		{@render children()}
	{/if}
</canvas>

<style lang="scss">
	.layer {
		background: transparent;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>
