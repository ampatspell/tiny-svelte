<script lang="ts">
  import Button from "$components/basic/button.svelte";
  import { untrack } from 'svelte';
  import { browser } from '$app/environment';

  type ModelProps = {
    name: string;
    source: string;
  }

  class Model {
    data = $state<ModelProps>();
    constructor(data: ModelProps) {
      this.data = data;
    }

    name = $derived(this.data!.name);
    source = $derived(this.data!.source);

    toggle() {
      this.data!.name = this.name === 'zeeba' ? 'neighba' : 'zeeba';
    }
  }

  let array = $state<Model[]>([
    new Model({ name: 'zeeba', source: 'initial' })
  ]);

  let addModel = (source: string) => {
    array.push(new Model({ name: 'zeeba', source }));
  }

  let needsInsert = $state(false);

  $effect(() => {
    if(needsInsert) {
      addModel('effect');
      untrack(() => {
        needsInsert = false;
      });
    }
  });

  let insertWithEffect = () => {
    needsInsert = true;
  };

  let insertDirectly = () => {
    addModel('direct');
  }

  let toggle = () => {
    array.forEach(model => model.toggle());
  }

  if(browser) {
    (window as any).array = array;
  }

  $inspect(array);
</script>

<div class="page">
  <div class="section">
    <div class="row"><Button value="Add model in effect" onClick={insertWithEffect}/></div>
    <div class="row"><Button value="Add model" onClick={insertDirectly}/></div>
    <div class="row"><Button value="Toggle name" onClick={toggle}/></div>
  </div>
  <div class="section">
    {#each array as model}
      <div class="row">
        name={model.name} data.name={model.data!.name} source={model.source}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
</style>
