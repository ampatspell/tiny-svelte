<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import type { ProjectsModel } from '$lib/models/projects/projects.svelte';

  let { projects }: { projects: ProjectsModel } = $props();
</script>

<div class="page">
  <div class="header">All projects</div>
  <Loadable model={projects}>
    {#each projects.all as project}
      <a class="project" href="/editor/projects/{project.id}">
        {project.identifier}
      </a>
    {/each}
  </Loadable>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    > .header {
      padding: 10px 15px;
      font-weight: 600;
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
