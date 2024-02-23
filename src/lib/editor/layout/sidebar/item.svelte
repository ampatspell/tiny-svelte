<script lang="ts">
	import type { Item } from './model';

	let { item } = $props<{
		item: Item;
	}>();
</script>

<a class="item" class:current={item.isCurrent} href={item.route}>
	<svelte:component this={item.icon} />
</a>

<style lang="scss">
	.item {
		$s: 40px;
		padding: 10px;
		width: $s;
		height: $s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		&:hover {
			background: fade-out(#000, 0.97);
		}
		&.current {
			background: fade-out(#000, 0.95);
		}
	}
</style>
