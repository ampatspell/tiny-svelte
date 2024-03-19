<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Item from '$components/basic/inspector/item.svelte';
  import Identity from '$components/basic/inspector/item/identity.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import type { ProjectModel } from '$lib/models/project/project.svelte';

  let {
    project
  }: {
    project: ProjectModel;
  } = $props();
</script>

<Inspector>
  <Section>
    <Identity title="Project" />
    <Item title="ID">
      {project.id}
    </Item>
    <Item title="Identifier">
      {project.identifier}
    </Item>
  </Section>
</Inspector>
