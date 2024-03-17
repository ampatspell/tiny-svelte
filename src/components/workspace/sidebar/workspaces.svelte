<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import type { WorkspacesModel } from '$lib/models/project/workspaces/workspaces.svelte';

  let {
    workspaces,
    selected
  }: {
    workspaces: WorkspacesModel;
    selected: WorkspaceModel;
  } = $props();
</script>

<div class="workspaces">
  {#each workspaces.all as workspace}
    <a href="/editor/projects/{workspaces.project.id}/{workspace.id}" class:selected={workspace.id === selected.id}>{workspace.id}</a>
  {/each}
</div>

<style lang="scss">
  .workspaces {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    > a {
      display: flex;
      text-decoration: none;
      &.selected {
        font-weight: 600;
      }
    }
  }
</style>
