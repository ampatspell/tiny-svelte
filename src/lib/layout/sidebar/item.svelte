<script lang="ts">
	import type { EmptyObject } from '$lib/types';
	import type { ComponentType, SvelteComponent } from 'svelte';

	let { icon, route, isCurrent } = $props<{
		icon: ComponentType<SvelteComponent<EmptyObject>>;
		route: string;
		isCurrent: boolean;
	}>();
</script>

<a class="item" class:current={isCurrent} href={route}>
	<svelte:component this={icon} />
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
