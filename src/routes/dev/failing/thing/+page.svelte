<script lang="ts">
  let { data } = $props();
  let model = $derived(data.model);
  $effect(() => model.subscribe());

  let first = $derived(model.data?.[0]);
</script>

name={first?.name}, position=[{first?.position?.x}, {first?.position?.y}]
