<script lang="ts">
  import type { HasDescriptionAndSerialized } from '$lib/firebase/fire/model.svelte';
  import { stats } from '$lib/firebase/fire/stats.svelte';
  import type { HasSubscriber } from '$lib/firebase/fire/subscriber.svelte';
  import { setGlobal } from '$lib/utils/set-global';

  let log = (model: HasSubscriber) => {
    setGlobal({ model });
  };

  let render = (model: HasSubscriber) => {
    const description = (model as HasDescriptionAndSerialized).description;
    return description ?? model.toString();
  };
</script>

{#snippet models(models: HasSubscriber[])}
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
    <div class="title">Subscribed</div>
    {@render models(stats.subscribed)}
  </div>
  <div class="section">
    <div class="title">Listening</div>
    {@render models(stats.listening)}
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
