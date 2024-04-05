<script lang="ts">
  import { popups } from './model.svelte';
  import Popup from './popup.svelte';
</script>

{#each popups.all as popup (popup)}
  <Popup {popup} />
{/each}
