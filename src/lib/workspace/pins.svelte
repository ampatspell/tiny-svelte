<script lang="ts">
	import { Horizontal, PinModel, Vertical, type PinOnResize } from './model.svelte';
	import Pin from './pin.svelte';

	let { pixel, step, onResize } = $props<{
		pixel: number;
		step: number;
		onResize: PinOnResize;
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

	let size = $state(9);
	let offset = $derived(size / 2);
</script>

<div class="pins" style:--offset="{offset}px">
	{#each pins as pin}
		<Pin
			class="pin"
			{size}
			vertical={pin.vertical}
			horizontal={pin.horizontal}
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
