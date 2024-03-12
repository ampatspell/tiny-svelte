<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { ProjectsModel } from '$lib/models/projects.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let model = activate(new ProjectsModel());
</script>

<div class="projects">
  <div class="header">All projects</div>
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
