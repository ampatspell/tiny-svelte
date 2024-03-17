<script lang="ts">
  import type { BoxNodeModel } from '$components/workspace/content/model.svelte';
  import Node from '$components/workspace/content/node.svelte';
  import { multiplySize } from '$lib/utils/math';
  import Box from './box.svelte';

  let {
    model
  }: {
    model: BoxNodeModel;
  } = $props();

  let size = $derived(multiplySize(model.size, model.pixel));
</script>

<Node {model}>
  <Box {size} color={model.box.color} />
</Node>
