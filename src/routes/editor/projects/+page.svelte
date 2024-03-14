<script lang="ts">
  import Projects from '$components/routes/editor/projects/projects.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import { ProjectsModel } from '$lib/models/projects.svelte';

  let projects = new ProjectsModel();
  activate(projects);
</script>

<Projects {projects} />
