<script lang="ts">
  let {
    type,
    description,
  }: {
    type: string;
    description?: string;
  } = $props();
</script>

<div class="description">
  <div class="type">{type}</div>
  {#if description}
    <div class="description">{description}</div>
  {/if}
</div>

<style lang="scss">
  .description {
    display: flex;
    flex-direction: row;
    gap: 5px;
    > .description {
      color: fade-out(#000, 0.5);
    }
  }
</style>
