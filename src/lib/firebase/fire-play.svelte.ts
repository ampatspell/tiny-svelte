import type { EmptyObject } from '$lib/types/types';
import { getter } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc, query, where } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { setGlobal } from '$lib/utils/set-global';
import { Model } from './fire/model.svelte';
import { Document } from './fire/document.svelte';
import { QueryAll, QueryFirst } from './fire/query.svelte';
import { load } from './fire/firebase.svelte';
import { type ProjectData } from '$lib/types/project';
import { MapModel, MapModels } from './fire/models.svelte';

type FoofOptions = {
  doc: Document<ProjectData>;
};

export class Foof extends Model<FoofOptions> {
  doc = $derived(this.options.doc);

  id = $derived(this.doc.id);
  identifier = $derived(this.doc.data!.identifier);

  serialized = $derived(serialized(this, ['id', 'identifier', 'isSubscribed']));
}

type NestedOptions = {
  id: string;
};

export class Nested extends Model<NestedOptions> {
  id = $derived(this.options.id);
  coll = $derived(collection(firebase.firestore, 'projects'));
  ref = $derived(doc(this.coll, this.id));

  doc = new Document<ProjectData>({
    ref: getter(() => this.ref)
  });

  query = new QueryAll<ProjectData>({
    ref: getter(() => this.coll)
  });

  models = new MapModels({
    source: getter(() => this.query.content),
    target: (doc: Document<ProjectData>) => new Foof({ doc })
  });

  first = new QueryFirst<ProjectData>({
    ref: getter(() => this.coll)
  });

  model = new MapModel({
    source: getter(() => this.first.content),
    target: (doc) => new Foof({ doc })
  });

  dependencies = [this.doc, this.query, this.first];

  async load() {
    setGlobal({ nested: this });
    await load(this.dependencies, 'remote');
  }

  async add() {
    const ref = doc(this.coll);
    const document = new Document<ProjectData>({
      ref,
      data: {
        identifier: 'added'
      }
    });
    await document.save();
  }

  async deleteAdded() {
    const q = new QueryAll({ ref: query(this.coll, where('identifier', '==', 'added')) });
    await q.load();
    await Promise.all(q.content.map((doc) => doc.delete()));
  }

  serialized = $derived(serialized(this, ['id', 'isSubscribed']));
}

export class Thing extends Model<EmptyObject> {
  id = $state('hello');

  nested = new Nested({
    id: getter(() => this.id)
  });

  dependencies = [this.nested];

  async load() {
    await this.nested.load();
  }

  serialized = $derived(serialized(this, ['id', 'isSubscribed']));
}
