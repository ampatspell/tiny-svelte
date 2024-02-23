<script lang="ts">
	let { label } = $props<{
		label: string;
	}>();
</script>

<div class="placeholder">
	<div class="placeholder">{label}</div>
</div>

<style lang="scss">
	.placeholder {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		> .placeholder {
			color: fade-out(#000, 0.75);
		}
	}
</style>
