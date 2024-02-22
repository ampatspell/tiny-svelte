<script lang="ts">
  let { data } = $props();
  console.log(data);
</script>

<div class="page">
	<div class="row">
		Assets
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
