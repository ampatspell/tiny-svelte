<script lang="ts">
	import type { Snippet } from 'svelte';

	let { route, children } = $props<{
		children?: Snippet;
		route: string;
	}>();
</script>

<div class="list">
	<a class="content" href={route}>
		{#if children}
			{@render children()}
		{/if}
	</a>
</div>

<style lang="scss">
	.list {
		width: 100%;
		height: 100%;
		position: relative;
		> .content {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			overflow-y: auto;
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
			text-decoration: none;
		}
	}
</style>
