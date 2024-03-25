<script lang="ts">
  import Projects from '$features/editor/projects/projects.svelte';
  import { subscribe } from '$lib/firebase/fire/subscriber.svelte.js';

  let { data } = $props();
  let projects = $derived(data.projects);

  $effect(() => subscribe(projects));
</script>

<Projects {projects} />
