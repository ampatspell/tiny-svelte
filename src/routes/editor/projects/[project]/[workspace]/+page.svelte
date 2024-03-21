<script lang="ts">
  import Workspace from '$features/editor/workspace/workspace.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();
  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));

  // $inspect('selectedNodeId', workspace.selectedNodeId);
  // $inspect('value', workspace.selectedNode.value);
  // $inspect('nodes.all', workspace.nodes.all.map(m => [m.id, m.exists]));
  // $inspect('node', workspace.selectedNode.node?.id, workspace.selectedNode.node?.exists);
</script>

<Workspace {workspace} />
