<script lang="ts">
  import { activate } from '$lib/firebase/firestore.svelte';
  import Loadable from '../loadable.svelte';
  import { ProjectsModel } from '../models/projects.svelte';
  import Sorted from '../sorted.svelte';

  let model = new ProjectsModel();
  activate(model);
</script>

<div class="projects">
  <div class="header">All projects</div>
  <div class="actions">
    <Sorted width={90} model={model.orderBy} />
  </div>
  <Loadable model={model.query}>
    {#each model.all.content as project}
      <a class="project" href="/editor/projects/{project.id}">
        {project.identifier}
      </a>
    {/each}
  </Loadable>
</div>

<style lang="scss">
  .projects {
    display: flex;
    flex-direction: column;
    > .header {
      padding: 10px 15px;
      font-weight: 600;
    }
    > .actions {
      display: flex;
      flex-direction: row;
      padding: 10px 15px;
    }
    > .project {
      padding: 10px 15px;
      text-decoration: none;
      &:hover {
        background: fade-out(#000, 0.97);
      }
    }
  }
</style>
