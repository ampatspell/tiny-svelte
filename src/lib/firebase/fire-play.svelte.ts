import type { EmptyObject } from '$lib/types/types';
import { getter } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { doc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { setGlobal } from '$lib/utils/set-global';
import { Model } from './fire/model.svelte';
import { Document } from './fire/document.svelte';

type NestedOptions = {
  id: string;
};

export class Nested extends Model<NestedOptions> {
  id = $derived(this.options.id);
  ref = $derived(doc(firebase.firestore, `projects/${this.id}`));

  doc = new Document({
    ref: getter(() => this.ref)
  });

  serialized = $derived(serialized(this, ['id']));

  dependencies = [this.doc];

  async load() {
    setGlobal({ nested: this });
    await this.doc.promises.cached;
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
