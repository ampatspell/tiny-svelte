<script lang="ts">
  import type { ProjectModel } from '$lib/models/project/project.svelte';

  let {
    project
  }: {
    project: ProjectModel;
  } = $props();
</script>

{project}
