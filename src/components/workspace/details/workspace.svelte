<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Item from '$components/basic/inspector/item.svelte';
  import Identifier from '$components/basic/inspector/item/identifier.svelte';
  import Identity from '$components/basic/inspector/item/identity.svelte';
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
    <Identity title="Workspace" />
    <Identifier model={workspace} />
  </Section>
</Inspector>
