<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { ProjectsModel } from '$lib/models/projects.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import Button from '$components/basic/button.svelte';
  import { reset } from '$lib/firebase/reset.svelte';
  import Foof from './foof.svelte';

  let model = activate(new ProjectsModel());
</script>

<div class="projects">
  <div class="header">All projects</div>
  <div class="actions">
    <Button value="Toggle" onClick={() => model.toggle()} />
    <Button value="Reset" onClick={() => reset()} />
  </div>
  <Loadable model={model.query}>
    {#each model.all.content as project}
      <a class="project" href="/editor/projects/{project.id}">
        {project.identifier}
        <Foof doc={project.doc} />
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
      gap: 10px;
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
