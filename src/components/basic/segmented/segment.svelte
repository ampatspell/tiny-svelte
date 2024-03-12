<script lang="ts">
  import type { VoidCallback } from '$lib/types/types';

  let { value, isSelected, onClick } = $props<{
    value: string;
    isSelected: boolean;
    onClick?: VoidCallback;
  }>();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="segment" class:selected={isSelected} onclick={onClick}>{value}</div>

<style lang="scss">
  .segment {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
    border-radius: 2px;
    &.selected {
      background: #222;
      color: #fff;
    }
  }
</style>
