<script lang="ts">
  import Projects from '$features/editor/projects/projects.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();
  let projects = $derived(data.projects);

  $effect(() => activate(projects));
</script>

<Projects {projects} />
