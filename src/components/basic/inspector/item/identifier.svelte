<script lang="ts">
  import Input from '$components/basic/input.svelte';
  import Item from '../item.svelte';
  import type { HasIdentifier, HasMutablePosition } from '../types';

  let {
    model
  }: {
    model: HasIdentifier;
  } = $props();

  let onEnter = (value: string) => {
    value = value.trim();
    if (!value.length) {
      return false;
    }
    model.onIdentifier(value);
  };
</script>

<Item title="Identifier">
  <Input value={model.identifier} {onEnter} />
</Item>
