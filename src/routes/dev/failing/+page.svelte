<script lang="ts">
  import { Thing, subscribe } from './models.svelte';

  let thing = new Thing({});
  $effect.pre(() => {
    subscribe(thing);
  });
</script>

<div class="page">
  <div class="section">
    <div class="title">Documents</div>
    <div class="content">
      {#each thing.query.content as doc}
        <div class="row">{doc.description}</div>
      {/each}
    </div>
  </div>
  <div class="section">
    <div class="title">Models</div>
    <div class="content">
      {#each thing.models.content as model}
        <div class="row">{model.description}</div>
      {/each}
    </div>
  </div>
  <div class="section">
    <div class="title">Wrappers</div>
    <div class="content">
      {#each thing.wrappers.content as model}
        <div class="row">{model.description}</div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
      > .title {
        font-weight: 600;
      }
      > .content {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    }
  }
</style>
