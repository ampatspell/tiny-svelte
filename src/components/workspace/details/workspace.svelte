<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

{workspace}
