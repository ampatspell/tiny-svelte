<script lang="ts">
	import Home from '$lib/icons/mingcute-lighthouse-line.svelte';
	import Editor from '$lib/icons/mingcute-department-line.svelte';
	import Mushroom from '$lib/icons/mingcute-mushroom-line.svelte';
	import Item from './sidebar/item.svelte';

	// let page = useCurrentPage();

	// let isCurrent = $derived.by<boolean>(() => {
	//   let id = page.current?.route.id;
	//   if(!id) {
	//     return false;
	//   }
	//   if(route === '/') {
	//     return id === '/';
	//   }
	//   return id === route;
	// });

	// let equals = () => {}

	let items = [
		{ icon: Home, route: '/', isCurrent: false },
		{ icon: Editor, route: '/editor', isCurrent: true },
		{ icon: Mushroom, route: '/editor/assets', isCurrent: false }
	];
</script>

<div class="sidebar">
	{#each items as item (item)}
		<Item {...item} />
	{/each}
</div>

<style lang="scss">
	.sidebar {
		background: fade-out(#000, 0.98);
		border-right: 1px solid fade-out(#000, 0.95);
	}
</style>
