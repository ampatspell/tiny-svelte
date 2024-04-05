<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import Box from './box.svelte';
  import Missing from './missing.svelte';
  import Node from './base/node.svelte';
  import Sprite from './sprite.svelte';
  import Scene from './scene.svelte';
  import SceneLayer from './scene-layer.svelte';

  let { node }: { node: WorkspaceNodeModel } = $props();

  let asset = $derived(node.asset);
  let type = $derived(asset?.type);
</script>

<Node {node}>
  {#if type}
    {#if type === 'box'}
      <Box {node} />
    {:else if type === 'sprite'}
      <Sprite {node} />
    {:else if type === 'scene'}
      <Scene {node} />
    {:else if type === 'scene-layer'}
      <SceneLayer {node} />
    {:else}
      <Missing />
    {/if}
  {:else}
    <Missing />
  {/if}
</Node>
