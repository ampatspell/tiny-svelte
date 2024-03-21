<script lang="ts">
  import { getter, options } from '$lib/utils/args';
  import { removeObject } from '$lib/utils/array';

  class Model {
    id = $state('');
    exists = $state<boolean>();
    constructor(id: string) {
      this.id = id;
      this.exists = true;
    }
  }

  type CollectionOptions = {
    array: Model[];
    id: string;
  };

  class Collection {
    options: CollectionOptions;
    constructor(options: CollectionOptions) {
      this.options = options;
    }

    array = $derived.by(() => this.options.array);
    id = $derived.by(() => this.options.id);

    _model = $derived.by(() => this.array.find((model) => model.id === this.id));

    model = $derived.by(() => {
      let model = this._model;
      if (model && model.exists) {
        return model;
      }
    });
  }

  let two = new Model('two');
  let array = $state<Model[]>([]);

  $effect(() => {
    array = [new Model('one'), two];
  });

  let collection = new Collection(
    options({
      array: getter(() => array),
      id: 'two'
    })
  );

  // let array = $state<Model[]>([]);

  // $effect(() => {
  //   array = [ new Model('one'), new Model('two') ];
  // });

  // let derivedArray = $derived.by(() => array);
  // let first = $derived.by(() => derivedArray.find(() => true));

  let remove = $state(false);

  $effect(() => {
    if (remove) {
      two.exists = false;
      remove = false;
    }
  });

  let onclick = () => {
    remove = true;
  };
</script>

<div class="page">
  <div class="row">
    <button type="button" {onclick}>Remove</button>
  </div>
  <div class="row">{collection.model?.id}</div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
