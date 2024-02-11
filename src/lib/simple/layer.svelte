<script lang="ts">
	import type { Snippet } from "svelte";
	import { getStageContext } from "./context.svelte";

  let { children } = $props<{
    children?: Snippet
  }>();

  let stage = getStageContext();

</script>

{#if children}
  {@render children()}
{/if}
