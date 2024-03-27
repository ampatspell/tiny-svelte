<script lang="ts">
  let { value }: { value: string } = $props();
</script>

<div class="identifier">{value}</div>

<style lang="scss">
  .identifier {
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
