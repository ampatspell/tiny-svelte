<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import Identity from './identity.svelte';

  let { model }: { model: WorkspaceNodeModel } = $props();

  let humanType = $derived(model.asset?.humanType);
  let title = $derived(`Node → ${humanType ?? 'Missing'}`);
</script>

<Identity {title} />
