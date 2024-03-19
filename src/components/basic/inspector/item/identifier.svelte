<script lang="ts">
  import type { HasMutableIdentifier } from '../types';
  import String from './string.svelte';

  let {
    model
  }: {
    model: HasMutableIdentifier;
  } = $props();

  let value = $derived(model.identifier);
  let onValue = (value: string) => model.onIdentifier(value);
</script>

<String title="Identifier" {value} {onValue} />
