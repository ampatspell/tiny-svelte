<script lang="ts">
  import { Things } from '../model.svelte.js';

  let model = new Things();
  $effect(() => model.subscribe());
</script>

{#each model.content as thing}
  <div class="row">name={thing.data?.name}, position=[{thing.position?.x}, {thing.position?.y}]</div>
{/each}
