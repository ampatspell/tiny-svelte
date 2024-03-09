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
    padding: 5px 10px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    &.selected {
      background: #222;
      color: #fff;
    }
  }
</style>
