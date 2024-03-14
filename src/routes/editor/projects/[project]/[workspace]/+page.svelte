<script lang="ts">
  import Workspace from '$components/routes/editor/projects/project/workspace/workspace.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();
  let workspace = $derived(data.workspace);

  $effect(() => {
    activate(workspace);
  });
</script>

<Workspace {workspace} />
