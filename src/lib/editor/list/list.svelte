<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children } = $props<{
		children?: Snippet;
	}>();
</script>

<div class="list">
	<div class="content">
		{#if children}
			{@render children()}
		{/if}
	</div>
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
		}
	}
</style>
