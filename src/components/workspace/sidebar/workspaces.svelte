<script lang="ts">
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';
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

<List>
  {#each workspaces.all as workspace}
    <Item route="/editor/projects/{workspaces.project.id}/{workspace.id}" isSelected={workspace.id === selected.id}>
      {workspace.identifier}
    </Item>
  {/each}
</List>
