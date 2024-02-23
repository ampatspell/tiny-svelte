<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, value, isDisabled, onClick } = $props<{
		children?: Snippet;
		value?: string;
		isDisabled?: boolean;
		onClick?: (e: Event) => void;
	}>();
</script>

<button class="button" type="button" disabled={isDisabled} onclick={onClick}>
	{#if children}
		{@render children()}
	{:else}
		{value}
	{/if}
</button>

<style lang="scss">
	.button {
		border: 1px solid #eee;
		padding: 5px 10px;
		border-radius: 3px;
		font-weight: bold;
		&:not(:disabled) {
			&:hover {
				background: fade-out(#000, 0.98);
			}
		}
	}
</style>
