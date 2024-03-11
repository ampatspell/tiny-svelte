<script lang="ts">
  import type { Callback } from '$lib/types';

  let { value, isSelected, onClick } = $props<{
    value: string;
    isSelected: boolean;
    onClick?: Callback;
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
    padding: 5px 10px;
    border-radius: 2px;
    &.selected {
      background: #222;
      color: #fff;
    }
  }
</style>
