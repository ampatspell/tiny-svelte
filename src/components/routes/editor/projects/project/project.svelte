<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import { ProjectModel } from '$lib/models/project.svelte';

  let { id } = $props<{
    id: string;
  }>();

  let project = activate(new ProjectModel({ id: id }));
</script>

<Loadable model={project.doc}>
  <Loadable model={project.workspaces.query}>
    <div class="project">
      <div class="row">{project.description}</div>
      {#each project.workspaces.query.content as workspace}
        <div class="row">{workspace}</div>
      {/each}
    </div>
  </Loadable>
</Loadable>

<style lang="scss">
  .project {
    padding: 10px;
  }
</style>
