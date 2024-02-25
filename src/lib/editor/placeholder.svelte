<script lang="ts">
	import type { Snippet } from "svelte";

	let { label, children } = $props<{
		label: string;
		children?: Snippet;
	}>();
</script>

<div class="placeholder">
	<div class="placeholder">
		<div class="label">{label}</div>
		{#if children}
			<div class="content">{@render children()}</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.placeholder {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		> .placeholder {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
