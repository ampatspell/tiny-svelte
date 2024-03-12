<script lang="ts">
  import Project from '$components/routes/editor/projects/project/project.svelte';

  let { data } = $props();
</script>

<Project id={data.project} />
