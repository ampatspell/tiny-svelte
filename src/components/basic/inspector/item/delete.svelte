<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import Item from '../item.svelte';
  import type { HasDelete } from '../types';

  let { model }: { model: HasDelete } = $props();

  let isDeleting = $state(false);

  let onDelete = async () => {
    isDeleting = true;
    try {
      await model.delete();
    } finally {
      isDeleting = false;
    }
  };
</script>

<Item>
  <Button value="Delete" isDisabled={isDeleting} onClick={onDelete} />
</Item>
