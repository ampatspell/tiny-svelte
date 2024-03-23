<script lang="ts">
  import Workspace from '$features/editor/workspace/workspace.svelte';
  import { subscribe } from '$lib/firebase/fire/subscriber.svelte.js';

  let { data } = $props();
  let workspace = $derived(data.workspace);
  $effect(() => subscribe(workspace));
</script>

<Workspace {workspace} />
