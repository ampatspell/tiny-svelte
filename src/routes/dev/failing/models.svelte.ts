import type { EmptyObject, VoidCallback } from '$lib/types/types';
import { getter, options, type OptionsInput } from '$lib/utils/args';
import { untrack } from 'svelte';

export type HasSubscribe = {
  subscribe: () => VoidCallback;
};

export type DocumentData = {
  props: {
    index: number;
  };
};

export class Base<Options> {
  options: Options;
  constructor(opts: OptionsInput<Options>) {
    this.options = options(opts);
  }
}

export type DocumentOptions = EmptyObject;

export class Document extends Base<DocumentOptions> {
  data = $state<DocumentData>();

  description = $derived(`<Document data=${this.data?.props.index}>`);
}

export type QueryOptions = EmptyObject;

export class Query extends Base<QueryOptions> implements HasSubscribe {
  content = $state<Document[]>([]);

  subscribe() {
    return $effect.root(() => {
      untrack(() => {});

      $effect.pre(() => {
        const interval = setInterval(() => {
          this.onSnapshot();
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      });
    });
  }

  index = 0;

  onSnapshot() {
    console.log('set', $effect.active());

    const document = new Document({});
    document.data = { props: { index: ++this.index } };
    this.content.splice(0, 0, document);

    this.content.forEach((doc) => {
      doc.data = { props: { index: ++this.index } };
    });
  }
}

export type ModelOptions = {
  document: Document;
};

export class Model extends Base<ModelOptions> {
  document = $derived(this.options.document);

  data = $derived(this.document.data!);
  index = $derived(this.data.props.index);

  description = $derived(`<Model index=${this.index}>`);
}

export type WrapperModelOptions = {
  model: () => Model;
};

export class WrapperModel extends Base<WrapperModelOptions> {
  model = $derived(this.options.model());
  index = $derived(this.model.index);

  description = $derived(`<WrapperModel index=${this.index}>`);
}

export type MapModelsOptions<I, O> = {
  source: I[];
  target: (doc: I) => O;
};

export class MapModels<I, O> extends Base<MapModelsOptions<I, O>> {
  source = $derived(this.options.source);
  target = $derived(this.options.target);
  cache = new Map<I, O>();

  findOrCreate(doc: I) {
    let out = this.cache.get(doc);
    if (!out) {
      out = this.target(doc);
      this.cache.set(doc, out);
    }
    return out;
  }

  content = $derived(this.source.map((doc) => this.findOrCreate(doc)));
}

export class Thing extends Base<EmptyObject> implements HasSubscribe {
  query = new Query({});

  models = new MapModels({
    source: getter(() => this.query.content),
    target: (document) => new Model({ document })
  });

  wrappers = new MapModels({
    source: getter(() => this.models.content),
    target: (model) => new WrapperModel({ model: () => model })
  });

  subscribe() {
    const query = this.query.subscribe();
    return () => {
      query();
    };
  }
}

export const subscribe = (model: HasSubscribe) => {
  return model.subscribe();
};
