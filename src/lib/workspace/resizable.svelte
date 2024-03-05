<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import type { Snippet } from 'svelte';
	import Pins from './pins.svelte';
	import type { OnResizeFn } from './model.svelte';

	let {
		class: _class,
		pixel,
		step,
		onResize,
		children
	} = $props<{
		class: Classes;
		pixel: number;
		step: number;
		onResize: OnResizeFn;
		children?: Snippet;
	}>();
</script>

<div class={classes('resizable', _class)}>
	<Pins {pixel} {step} {onResize} />
	<div class="content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="scss">
	.resizable {
		border: 1px solid fade-out(#ef476f, 0.75);
		transition: 0.15s ease-in-out border-color;
		position: relative;
		:global(> .pins) {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
		&:hover {
			border-color: fade-out(#ef476f, 0.5);
		}
	}
</style>
