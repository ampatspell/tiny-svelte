<script lang="ts">
  import Layout from '$components/routes/editor/layout/layout.svelte';
  import type { Snippet } from 'svelte';

  let {
    children
  }: {
    children: Snippet;
  } = $props();
</script>

<Layout {children} />
