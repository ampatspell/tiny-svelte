<script lang="ts">
  import Button from '$lib/editor/button.svelte';
  import { createTRPC } from '$lib/trpc/client.svelte';

  let rpc = createTRPC();

  let greeting = $state();
  let load = async () => {
    greeting = await rpc.assets.get.query({ id: 'default' });
  };
</script>

<div class="page">
  <div class="row">RPC</div>
  <div class="row">
    <Button value="Load" onClick={load} />
  </div>
  <div class="row json">{JSON.stringify(greeting, null, 2)}</div>
</div>

<style lang="scss">
  .page {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    > .row {
      &.json {
        white-space: nowrap;
      }
    }
  }
</style>
