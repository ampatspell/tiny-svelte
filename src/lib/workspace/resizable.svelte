<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import type { Snippet } from 'svelte';
	import Pins from './pins.svelte';
	import type { Horizontal, Vertical } from './model.svelte';
	import type { Point } from '$lib/types';

	let {
		class: _class,
		children,
		pixel,
		step
	} = $props<{
		class: Classes;
		pixel: number;
		step: number;
		children?: Snippet;
	}>();

	let onResize = (vertical: Vertical, horizontal: Horizontal, point: Point) => {
		console.log(vertical, horizontal, point);
	};
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
