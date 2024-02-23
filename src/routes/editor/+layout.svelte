<script lang="ts">
	import Sidebar from '$lib/layout/sidebar.svelte';
</script>

<div class="layout">
	<Sidebar />
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.layout {
		flex: 1;
		display: flex;
		flex-direction: row;
		> .content {
			flex: 1;
		}
	}
</style>
