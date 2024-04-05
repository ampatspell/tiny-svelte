<script lang="ts">
  import Dropdown from '$components/basic/dropdown/dropdown.svelte';

  type Name = {
    name: string;
  };

  let names: Name[] = [{ name: 'zeeba' }, { name: 'larry' }, { name: 'croc' }, { name: 'hamster' }];

  let selected = $state<Name>(names[0]);
</script>

<div class="page">
  <div class="content">
    <Dropdown {selected} items={names}>
      {#snippet item(item)}
        {item.name}
      {/snippet}
    </Dropdown>
  </div>
</div>

<style lang="scss">
  .page {
    padding: 15px;
    > .content {
      width: 300px;
    }
  }
</style>
