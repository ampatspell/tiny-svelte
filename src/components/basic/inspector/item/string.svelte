<script lang="ts">
  import Input from '$components/basic/input.svelte';
  import Item from '../item.svelte';

  let {
    title,
    value,
    onValue
  }: {
    title: string;
    value: string;
    onValue: (value: string) => void;
  } = $props();

  let onEnter = (value: string) => {
    value = value.trim();
    if (!value.length) {
      return false;
    }
    onValue(value);
  };
</script>

<Item {title}>
  <Input {value} {onEnter} />
</Item>
