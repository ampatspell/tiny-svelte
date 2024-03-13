<script lang="ts">
  import Project from '$components/routes/editor/projects/project/project.svelte';

  let {
    data
  }: {
    data: { project: string };
  } = $props();
</script>

<Project id={data.project} />
