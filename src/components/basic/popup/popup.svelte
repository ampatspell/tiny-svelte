<script lang="ts">
  import type { Point } from '$lib/types/schema';
  import type { PopupModel } from './model.svelte';

  let { popup }: { popup: PopupModel } = $props();

  let position = $state<Point>()!;
  let update = () => {
    position = popup.relativeTo?.position ?? { x: 0, y: 0 };
  };
  $effect.pre(() => update());
</script>

<svelte:window onresize={update} onscroll={update} />

<div class="popup" style:--top="{position.y}px" style:--left="{position.x}px">
  <svelte:component this={popup.component} {...popup.props} />
</div>

<style lang="scss">
  .popup {
    width: fit-content;
    position: fixed;
    top: var(--top);
    left: var(--left);
    border-radius: 3px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 2px 10px 3px fade-out(#000, 0.98);
  }
</style>
