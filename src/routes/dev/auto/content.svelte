<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import Json from '$components/basic/json.svelte';
  import { Thing } from '$lib/firebase/fire-play.svelte';
  import { subscribe } from '$lib/firebase/fire.svelte';

  let thing = new Thing({});

  subscribe(thing);

  let toggleId = () => {
    thing.id = thing.id === 'hello' ? 'kitty' : 'hello';
  };
</script>

<div class="page">
  <div class="section">
    <div class="row"><Button value="Toggle id" onClick={toggleId} /></div>
  </div>

  <div class="section">
    {#await thing.load()}
      Loading…
    {:then thing}
      {thing}
    {/await}
  </div>

  <div class="section">
    <div class="row">{thing.id}</div>
    <div class="row">{thing.nested.doc.id}</div>
    <div class="row">{thing.nested.doc.isLoading}</div>
    <div class="row"><Json value={thing.nested.doc.data} /></div>
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
</style>
