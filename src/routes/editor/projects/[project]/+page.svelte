<script lang="ts">
  import Project from '$components/routes/editor/projects/project/project.svelte';
  import { activate } from '$lib/firebase/firestore.svelte.js';

  let { data } = $props();
  let project = $derived(data.project);

  $effect(() => {
    activate(project);
  });
</script>

<Project {project} />
