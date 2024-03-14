<script lang="ts">
  import Workspace from '$components/routes/editor/projects/project/workspace/workspace.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import type { WorkspaceModel } from '$lib/models/project.svelte';

  let {
    data
  }: {
    data: {
      workspace: WorkspaceModel;
    };
  } = $props();

  let workspace = $derived(data.workspace);

  $effect(() => {
    activate(workspace);
  });
</script>

<Workspace {workspace} />
