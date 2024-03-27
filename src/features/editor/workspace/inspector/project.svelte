<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Identifier from '$components/basic/inspector/item/identifier.svelte';
  import Identity from '$components/basic/inspector/item/identity.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import type { ProjectModel } from '$lib/models/project/project.svelte';

  let {
    project,
  }: {
    project: ProjectModel;
  } = $props();
</script>

<Inspector>
  <Section>
    <Identity title="Project" model={project} />
    <Identifier model={project} />
  </Section>
</Inspector>
