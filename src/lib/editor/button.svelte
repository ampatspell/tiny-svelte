<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, value, isDisabled, onClick, route } = $props<{
		children?: Snippet;
		value?: string;
		isDisabled?: boolean;
		onClick?: (e: Event) => void;
		route?: string;
	}>();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{:else}
		{value}
	{/if}
{/snippet}

{#if onClick}
	<button class="button" type="button" disabled={isDisabled} onclick={onClick}>
		{@render content()}
	</button>
{:else}
	<a class="button" type="button" href={isDisabled ? undefined : route}>
		{@render content()}
	</a>
{/if}

<style lang="scss">
	.button {
		display: flex;
		flex-direction: row;
		gap: 5px;
		border: 1px solid #eee;
		padding: 5px 10px;
		border-radius: 3px;
		font-weight: bold;
		text-decoration: none;
		&:not(:disabled) {
			&:hover {
				background: fade-out(#000, 0.98);
			}
		}
	}
</style>
