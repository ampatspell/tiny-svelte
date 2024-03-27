<script lang="ts">
  import type { Snippet } from 'svelte';
  import Render from './render.svelte';
  import type { Point } from '$lib/types/schema';

  let {
    position,
    children,
  }: {
    position?: Point;
    children?: Snippet;
  } = $props();

  let draw = () => {};
</script>

<Render name="group" {position} model={null} {draw}>
  {#if children}
    {@render children()}
  {/if}
</Render>
