<script lang="ts">
  import { activators, type HasActivator, type HasDescriptionAndSerialized } from '$lib/firebase/firestore.svelte';
  import { setGlobal } from '$lib/utils/set-global';

  let log = (model: HasActivator) => {
    setGlobal({ model });
  };

  let render = (model: HasActivator) => {
    // TODO: mess
    const description = (model as HasDescriptionAndSerialized).description;
    return description ?? model.toString();
  };
</script>

{#snippet models(models: HasActivator[])}
  <div class="models">
    {#each models as model}
      <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
      <div class="model" onclick={() => log(model)}>
        {render(model)}
      </div>
    {:else}
      <div class="placeholder">No models</div>
    {/each}
  </div>
{/snippet}

<div class="activated">
  <div class="section">
    <div class="title">Activated</div>
    {@render models(activators.activated)}
  </div>
  <div class="section">
    <div class="title">Subscribed</div>
    {@render models(activators.subscribed)}
  </div>
</div>

<style lang="scss">
  .activated {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: fade-out(#000, 0.98);
    border: 1px solid fade-out(#000, 0.95);
    > .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
      > .title {
        padding: 10px;
        font-weight: 600;
      }
    }
  }

  .models {
    display: flex;
    flex-direction: column;
    > .placeholder,
    > .model {
      padding: 10px;
      border-bottom: 1px solid fade-out(#000, 0.97);
      &:first-child {
        border-top: 1px solid fade-out(#000, 0.97);
      }
    }
    > .model {
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background: fade-out(#000, 0.97);
      }
    }
  }
</style>
