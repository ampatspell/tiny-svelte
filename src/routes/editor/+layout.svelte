<script lang="ts">
  import type { Snippet } from 'svelte';
  import Layout from '$features/editor/layout/layout.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
