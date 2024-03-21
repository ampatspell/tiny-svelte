<script lang="ts">
  import { getter, options } from '$lib/utils/args';

  class Model {
    id = $state<string>()!;
    exists = $state(true);
    constructor(id: string) {
      this.id = id;
    }
  }

  class Collection {
    content = $state<Model[]>([]);
  }

  let collection = new Collection();
  let three = new Model('three');

  $effect(() => {
    collection.content = [new Model('one'), new Model('two'), three];
  });

  //

  type FilterOptions = {
    array: Model[];
    id: string;
  };

  class Filter {
    options: FilterOptions;
    constructor(options: FilterOptions) {
      this.options = options;
    }

    array = $derived.by(() => this.options.array);
    id = $derived.by(() => this.options.id);

    _model = $derived.by(() => {
      return this.array.find((model) => model.id === this.id);
    });

    model = $derived.by(() => {
      let model = this._model;
      if (model?.exists) {
        return model;
      }
    });
  }

  let filter = new Filter(
    options({
      array: getter(() => collection.content),
      id: 'three'
    })
  );

  let remove = $state(false);

  $effect(() => {
    if (remove) {
      remove = false;
      collection.content = [];
    }
  });

  let onclick = () => {
    remove = true;
  };
</script>

<div class="page">
  <div class="section">
    <button type="button" {onclick}>Remove 1st</button>
  </div>
  <div class="section">
    {filter.model?.id}
  </div>
  <div class="section">
    {#each collection.content as model}
      <div class="row">
        {model.id}
        {model.exists}
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
