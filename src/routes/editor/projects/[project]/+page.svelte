<script lang="ts">
  import Project from '$features/editor/project/project.svelte';
  import { activate } from '$lib/firebase/firestore.svelte.js';
  import type { ProjectModel } from '$lib/models/project/project.svelte';

  let { data }: { data: { project: ProjectModel } } = $props();
  let project = $derived(data.project);

  $effect(() => activate(project));
</script>

<Project {project} />
