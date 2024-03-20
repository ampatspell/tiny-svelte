<script lang="ts">
  import { untrack } from 'svelte';

  type ModelProps = {
    name: string;
    source: string;
  };

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

  let array = $state<Model[]>([new Model({ name: 'zeeba', source: 'initial' })]);

  let addModel = (source: string) => {
    array.push(new Model({ name: 'zeeba', source }));
  };

  let needsInsert = $state(false);

  $effect(() => {
    if (needsInsert) {
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
  };

  let toggle = () => {
    array.forEach((model) => model.toggle());
  };

  // $inspect(array);
</script>

<div class="page">
  <div class="section">
    <div class="row"><button onclick={insertWithEffect}>Add model in effect</button></div>
    <div class="row"><button onclick={insertDirectly}>Add model</button></div>
    <div class="row"><button onclick={toggle}>Toggle name</button></div>
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
