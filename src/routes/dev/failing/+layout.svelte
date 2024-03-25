<script lang="ts">
  let { data } = $props();
  $effect(() => data.model.subscribe());
</script>

<slot/>
