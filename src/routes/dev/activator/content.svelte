<script lang="ts">
  import { Projects, activate, activators } from '$lib/firebase/another.svelte';

  let { model } = $props<{
    model: Projects;
  }>();

  activate(model);
</script>

<div class="content">
  <div class="row">
    {#each activators.all as model}
      <div class="model">{model.description ?? model.constructor.name}</div>
    {/each}
  </div>
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
