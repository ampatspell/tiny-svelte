<script lang="ts">
  let { data } = $props();
  let model = $derived(data.things);
  $effect(() => model.subscribe());
</script>

<div class="page">
  <div>name = {model.names}</div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
