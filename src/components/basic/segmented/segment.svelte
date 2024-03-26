<script lang="ts">
  import type { VoidCallback } from '$lib/types/types';

  let {
    value,
    isSelected,
    isDisabled,
    onClick: _onClick
  }: {
    value: string;
    isSelected: boolean;
    isDisabled?: boolean;
    onClick?: VoidCallback;
  } = $props();

  let onClick = () => {
    if (isDisabled) {
      return;
    }
    _onClick?.();
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="segment" class:selected={isSelected} class:disabled={isDisabled} onclick={onClick}>{value}</div>

<style lang="scss">
  .segment {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
    border-radius: 2px;
    transition: opacity 0.15s ease-in-out;
    &.selected {
      background: #222;
      color: #fff;
    }
    &.disabled {
      opacity: 0.3;
    }
  }
</style>
