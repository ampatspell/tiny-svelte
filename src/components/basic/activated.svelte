<script lang="ts">
  import { activators, type HasActivator } from '$lib/firebase/firestore.svelte';
  import { setGlobal } from '$lib/utils/set-global';

  let log = (model: HasActivator) => {
    setGlobal({ model });
  };
</script>

<div class="activated">
  {#each activators.all as model}
    <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
    <div class="model" onclick={() => log(model)}>
      {model.description ?? model.toString()}
    </div>
  {/each}
</div>

<style lang="scss">
  .activated {
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
