<script lang="ts">
  import { activators, type HasActivator } from '$lib/firebase/firestore.svelte';
  import { setGlobal } from '$lib/utils/set-global';

  let log = (model: HasActivator) => {
    setGlobal({ model });
  };
</script>

{#snippet models(models: HasActivator[])}
  <div class="models">
    {#each models as model}
      <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
      <div class="model" onclick={() => log(model)}>
        {model.description ?? model.toString()}
      </div>
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
    > .model {
      border-bottom: 1px solid fade-out(#000, 0.97);
      &:last-child {
        border-bottom: none;
      }
      padding: 10px;
      &:hover {
        background: fade-out(#000, 0.97);
      }
    }
  }
</style>
