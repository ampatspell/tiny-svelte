<script lang="ts">
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import type { WorkspacesModel } from '$lib/models/project/workspaces/workspaces.svelte';
  import Content from './-list/content/content.svelte';
  import Description from './-list/content/description.svelte';
  import Identifier from './-list/content/identifier.svelte';

  let {
    workspaces,
    selected,
  }: {
    workspaces: WorkspacesModel;
    selected: WorkspaceModel;
  } = $props();
</script>

<List>
  {#each workspaces.all as workspace}
    <Item route="/editor/projects/{workspaces.project.id}/{workspace.id}" isSelected={workspace.id === selected.id}>
      <Content>
        <Identifier value={workspace.identifier} />
        <Description type={workspace.id} />
      </Content>
    </Item>
  {/each}
</List>
