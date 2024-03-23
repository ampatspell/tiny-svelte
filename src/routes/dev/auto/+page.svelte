<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import { stats } from '$lib/firebase/fire/stats.svelte';
  import Content from './content.svelte';

  let show = $state(true);
  let onToggle = () => (show = !show);
</script>

<div class="page">
  <div class="row">
    <Button value="Toggle content" onClick={onToggle} />
    <a href="/">Back</a>
  </div>
  <div class="row">
    {#if show}
      <Content />
    {/if}
  </div>
  <div class="row">
    {#each stats.subscribed as model}
      <div class="row">{model}</div>
    {/each}
  </div>
  <div class="row">
    {#each stats.listening as model}
      <div class="row">{model}</div>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
