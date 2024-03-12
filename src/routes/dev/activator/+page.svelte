<script lang="ts">
  import Activated from '$components/activated.svelte';
  import Button from '$components/editor/button.svelte';
  import { Projects } from '$lib/firebase/experiments.svelte';
  import Content from './content.svelte';

  let model = new Projects();

  let show = $state(false);
  let toggle = () => (show = !show);
</script>

<div class="page">
  <div class="row">
    Show: {show}
  </div>
  <div class="row">
    <Button value="Toggle" onClick={toggle} />
    <Button value="Order" onClick={() => model.toggleOrder()} />
  </div>

  <div class="row">
    {model.activator.isActivated}
    {model.activator.owner.description}
  </div>
  <div class="row">
    {model.query.activator.isActivated}
    {model.query.activator.owner.description}
  </div>

  <div class="row">
    <Activated />
  </div>

  {#if show}
    <Content {model} />
  {/if}
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
