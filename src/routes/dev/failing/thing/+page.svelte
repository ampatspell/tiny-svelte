<script lang="ts">
  let { data } = $props();
  let model = $derived(data.model);
  $effect(() => model.subscribe());
</script>

name={model.data?.name}, position=[{model.position?.x}, {model.position?.y}]
