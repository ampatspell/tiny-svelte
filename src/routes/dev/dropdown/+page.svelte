<script lang="ts">
  import Dropdown from '$components/basic/dropdown/dropdown.svelte';

  type Name = {
    name: string;
  };

  let names: Name[] = [{ name: 'zeeba' }, { name: 'larry' }, { name: 'croc' }, { name: 'hamster' }];

  let selected = $state.frozen<Name | undefined>(names[0]);
  let onSelect = (model?: Name) => {
    selected = model;
  };
</script>

<div class="page">
  <div class="content">
    <Dropdown {selected} items={names} {onSelect}>
      {#snippet item(item)}
        {item.name}
      {/snippet}
    </Dropdown>
  </div>
</div>

<style lang="scss">
  .page {
    min-height: 300vh;
    padding: 15px;
    > .content {
      width: 300px;
    }
  }
</style>
