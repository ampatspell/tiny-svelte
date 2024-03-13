<script lang="ts">
  import { multiplySize } from '$lib/utils/math';
  import type { BoxNodeModel } from '$components/workspace/model.svelte';
  import Node from '$components/workspace/node.svelte';
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
