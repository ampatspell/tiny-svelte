<script lang="ts">
  import Project from '$features/editor/project/project.svelte';
  import { subscribe } from '$lib/firebase/fire/subscriber.svelte';
  import type { ProjectModel } from '$lib/models/project/project.svelte';

  let { data }: { data: { project: ProjectModel } } = $props();
  let project = $derived(data.project);

  $effect(() => subscribe(project));
</script>

<Project {project} />
