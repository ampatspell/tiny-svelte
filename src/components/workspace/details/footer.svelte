<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Pixel from '$components/basic/inspector/item/pixel.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

<Inspector>
  <Section>
    <Pixel omitTitle={true} model={workspace} />
  </Section>
</Inspector>
