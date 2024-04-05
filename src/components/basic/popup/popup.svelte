<script lang="ts">
  import type { PopupModel } from './model.svelte';

  let { popup }: { popup: PopupModel } = $props();
</script>

<div class="popup">
  <svelte:component this={popup.component} {...popup.props} />
</div>

<style lang="scss">
  .popup {
    border: 1px solid red;
    width: fit-content;
  }
</style>
