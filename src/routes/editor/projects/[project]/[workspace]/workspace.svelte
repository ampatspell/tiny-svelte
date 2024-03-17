<script lang="ts">
  import { WorkspaceContext } from '$components/workspace/model.svelte';
  import Workspace from '$components/workspace/workspace.svelte';
  import type { WorkspaceModel } from '$lib/models/project.svelte';

  let { workspace }: { workspace: WorkspaceModel } = $props();

  let context = new WorkspaceContext();
</script>

{#each workspace.nodes._query.content as node (node)}
  <div class="row">{node}</div>
{/each}

<Workspace {context}></Workspace>
