<script lang="ts">
  import { WorkspaceContext } from '$components/workspace/content/model.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import Workspace from '$components/workspace/content/workspace.svelte';

  let { workspace }: { workspace: WorkspaceModel } = $props();

  let context = new WorkspaceContext();
</script>

{#each workspace.nodes.all as node}
  <div class="row">{node}</div>
{/each}

<Workspace {context}></Workspace>
