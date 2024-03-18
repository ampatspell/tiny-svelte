<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node
  }: {
    node: WorkspaceNodeModel;
  } = $props();
</script>

{node}
