<script lang="ts">
  import Item from '../item.svelte';
  import type { HasMutablePosition } from '../types';
  import IntegerInput from './blocks/integer-input.svelte';

  let {
    model
  }: {
    model: HasMutablePosition;
  } = $props();

  let onChange = (key: 'x' | 'y', value: number) => {
    const {
      position: { x, y }
    } = model;
    model.onPosition(Object.assign({ x, y }, { [key]: value }));
  };
</script>

<Item title="Position">
  <div class="content">
    <IntegerInput value={model.position.x} onChange={(value: number) => onChange('x', value)} />
    <IntegerInput value={model.position.y} onChange={(value: number) => onChange('y', value)} />
  </div>
</Item>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
</style>
