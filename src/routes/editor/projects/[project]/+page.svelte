<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { activate } from '$lib/firebase/firestore.svelte.js';
  import type { ProjectModel } from '$lib/models/project.svelte';

  let { data }: { data: { project: ProjectModel } } = $props();
  let project = $derived(data.project);

  $effect(() => activate(project));
</script>

<div class="page">
  <div class="header">{project.identifier} workspaces</div>
  <Loadable model={project}>
    {#each project.workspaces.query.content as workspace}
      <a class="workspace" href="/editor/projects/{project.id}/{workspace.id}">
        {workspace.data?.identifier}
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
    > .workspace {
      padding: 10px 15px;
      text-decoration: none;
      &:hover {
        background: fade-out(#000, 0.97);
      }
    }
  }
</style>
