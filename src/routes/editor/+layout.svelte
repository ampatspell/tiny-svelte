<script lang="ts">
  import Layout from '$components/routes/editor/layout/layout.svelte';
  import type { Snippet } from 'svelte';

  let { children } = $props<{
    children: Snippet;
  }>();
</script>

<Layout {children} />
