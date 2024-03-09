<script lang="ts">
  import { multiplySize } from '$lib/utils/math';
  import type { BoxNodeModel } from '$lib/workspace/model.svelte';
  import Node from '$lib/workspace/node.svelte';
  import Box from './box.svelte';

  let { model } = $props<{
    model: BoxNodeModel;
  }>();

  let size = $derived(multiplySize(model.size, model.pixel));
</script>

<Node {model}>
  <Box {size} color={model.box.color} />
</Node>
