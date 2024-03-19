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

    name = $derived(this.data?.name);
    source = $derived(this.data?.source);

    toggle() {
      this.data!.name = this.data!.name === 'zeeba' ? 'neighba' : 'zeeba';
    }
  }

  let model = $state<Model>(new Model({ name: 'zeeba', source: 'initial' }));

  let setModel = (source: string) => {
    let next = new Model({ name: 'zeeba', source });
    model = next;
  };

  let needsSet = $state(false);

  $effect(() => {
    if (needsSet) {
      setModel('effect');
      untrack(() => {
        needsSet = false;
      });
    }
  });

  let setWithEffect = () => {
    needsSet = true;
  };

  let setDirectly = () => {
    setModel('direct');
  };

  let toggle = () => {
    model.toggle();
  };

  // this breaks also non-effect case
  // $inspect(model.data, model.name);
</script>

<div class="page">
  <div class="section">
    <div class="row"><button onclick={setWithEffect}>Set model in effect</button></div>
    <div class="row"><button onclick={setDirectly}>Set model directly</button></div>
    <div class="row"><button onclick={toggle}>Toggle model.data.name</button></div>
  </div>
  <div class="section">
    <div class="row">
      name={model.name}
    </div>
    <div class="row">
      data.name={model.data?.name}
    </div>
    <div class="row">
      source={model.source}
    </div>
  </div>
</div>

<style>
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
</style>
