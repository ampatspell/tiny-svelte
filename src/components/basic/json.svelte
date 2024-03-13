<script lang="ts">
  let { value }: { value: unknown } = $props();

  let string = $derived.by(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch (err: unknown) {
      return (err as { message: string }).message;
    }
  });
</script>

<div class="json">{string}</div>

<style lang="scss">
  .json {
    white-space: pre-wrap;
    font-size: 11px;
  }
</style>
