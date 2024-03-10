import { getter, options } from '$lib/utils/args';
import { collection, doc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { Query, Document, QueryFirst } from './firestore.svelte';
import { activatable, type HasActivatable } from './activatable.svelte';

export type WeirdOptions = {
  id?: string;
};

export class Weird implements HasActivatable {
  options: WeirdOptions;

  constructor(opts: WeirdOptions) {
    this.options = opts;
  }

  doc = new Document(options({ ref: getter(() => this.ref) }));

  query = new Query(
    options({
      query: getter(() => {
        const ref = this.ref;
        if (ref) {
          return collection(ref, 'assets');
        }
      })
    })
  );

  get id() {
    return this.options.id;
  }

  get ref() {
    if (!this.id) {
      return;
    }
    return doc(collection(firebase.firestore, 'projects'), this.id);
  }

  activatable = activatable(this.doc, this.query);
}

export type ProjectOptions = {
  id: string;
};

export class Project implements HasActivatable {
  options: ProjectOptions;

  constructor(options: ProjectOptions) {
    this.options = options;
  }

  get id() {
    return this.options.id;
  }

  get ref() {
    return doc(firebase.firestore, `projects/${this.id}`);
  }

  doc = new Document(options({ ref: getter(() => this.ref) }));

  activatable = activatable(this.doc);
}

export type AssetsOptions = {
  project: Project;
};

export class Assets {
  options: AssetsOptions;

  constructor(options: AssetsOptions) {
    this.options = options;
  }

  get ref() {
    return collection(this.options.project.ref, 'assets');
  }

  query = new Query(
    options({
      query: getter(() => this.ref)
    })
  );

  first = new QueryFirst(
    options({
      query: getter(() => this.ref)
    })
  );

  activatable = activatable(this.query, this.first);
}
