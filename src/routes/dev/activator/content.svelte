<script lang="ts">
  import type { Projects } from '$lib/firebase/experiments.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { model } = $props<{
    model: Projects;
  }>();

  activate(model);
</script>

<div class="content">
  {#each model.query.content as project}
    <div class="row">{project.id}: {project.data?.identifier}</div>
  {/each}
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
