import type { EmptyObject } from '$lib/types/types';
import { getter } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { setGlobal } from '$lib/utils/set-global';
import { Model } from './fire/model.svelte';
import { Document } from './fire/document.svelte';
import { QueryAll, QueryFirst } from './fire/query.svelte';
import { load } from './fire/firebase.svelte';

type NestedOptions = {
  id: string;
};

export class Nested extends Model<NestedOptions> {
  id = $derived(this.options.id);
  coll = $derived(collection(firebase.firestore, 'projects'));
  ref = $derived(doc(this.coll, this.id));

  doc = new Document({
    ref: getter(() => this.ref)
  });

  query = new QueryAll({
    ref: getter(() => this.coll)
  });

  first = new QueryFirst({
    ref: getter(() => this.coll)
  });

  serialized = $derived(serialized(this, ['id']));

  dependencies = [this.doc, this.query, this.first];

  async load() {
    setGlobal({ nested: this });
    await load(this.dependencies, 'remote');
  }
}

export class Thing extends Model<EmptyObject> {
  id = $state('hello');

  nested = new Nested({
    id: getter(() => this.id)
  });

  serialized = $derived(serialized(this, ['id']));

  dependencies = [this.nested];

  async load() {
    await this.nested.load();
  }
}
