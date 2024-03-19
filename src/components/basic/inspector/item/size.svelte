<script lang="ts">
  import Item from '../item.svelte';
  import type { HasMutableSize } from '../types';
  import IntegerInput from './blocks/integer-input.svelte';

  let {
    model
  }: {
    model: HasMutableSize;
  } = $props();

  let onChange = (key: 'width' | 'height', value: number) => {
    const {
      size: { width, height }
    } = model;
    model.onSize(Object.assign({ width, height }, { [key]: value }));
  };
</script>

<Item title="Size">
  <div class="content">
    <IntegerInput value={model.size.width} onChange={(value: number) => onChange('width', value)} />
    <IntegerInput value={model.size.height} onChange={(value: number) => onChange('height', value)} />
  </div>
</Item>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
</style>
