<script lang="ts">
  import Pixel from '$components/basic/inspector/item/pixel.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

<Pixel omitTitle={true} model={workspace} />
