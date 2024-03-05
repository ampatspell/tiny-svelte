<script lang="ts">
	import type { Point, Size } from '$lib/types';
	import { Horizontal, PinModel, Vertical, type OnResizeFn } from './model.svelte';
	import Pin from './pin.svelte';

	let { pixel, step, position, size, onResize } = $props<{
		pixel: number;
		step: number;
		position: Point;
		size: Size;
		onResize: OnResizeFn;
	}>();

	let pins = [
		...[Horizontal.Left, Horizontal.Center, Horizontal.Right].map((horizontal) => {
			return new PinModel(Vertical.Top, horizontal, onResize);
		}),
		...[Horizontal.Left, Horizontal.Right].map((horizontal) => {
			return new PinModel(Vertical.Center, horizontal, onResize);
		}),
		...[Horizontal.Left, Horizontal.Center, Horizontal.Right].map((horizontal) => {
			return new PinModel(Vertical.Bottom, horizontal, onResize);
		})
	];

	let pinSize = $state(9);
	let offset = $derived(pinSize / 2);
</script>

<div class="pins" style:--offset="{offset}px">
	{#each pins as pin}
		<Pin
			class="pin"
			pin={pinSize}
			vertical={pin.vertical}
			horizontal={pin.horizontal}
			{position}
			{size}
			onResize={pin.onResize}
			{pixel}
			{step}
		/>
	{/each}
</div>

<style lang="scss">
	.pins {
		--o: calc(0px - var(--offset));

		:global(> .pin) {
			position: absolute;
			z-index: 1;
		}

		:global(> .pin.vertical-top) {
			top: var(--o);
		}

		:global(> .pin.vertical-bottom) {
			bottom: var(--o);
		}

		:global(> .pin.vertical-center) {
			top: calc(50% + var(--o));
		}

		:global(> .pin.horizontal-left) {
			left: var(--o);
		}

		:global(> .pin.horizontal-center) {
			right: calc(50% + var(--o));
		}

		:global(> .pin.horizontal-right) {
			right: var(--o);
		}
	}
</style>
