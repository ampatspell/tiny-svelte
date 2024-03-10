<script lang="ts">
  let { value } = $props<{ value: any }>();
  let string = $derived.by(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch (err) {
      return (err as any).message;
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
