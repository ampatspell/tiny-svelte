import { getter, options } from '$lib/utils/args';
import { collection, doc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { Query, Document, QueryFirst } from './firestore.svelte';
import type { Mountable } from './mountable.svelte';

export type WeirdOptions = {
  id?: string;
};

export class Weird implements Mountable {
  options: WeirdOptions;

  constructor(opts: WeirdOptions) {
    this.options = opts;
  }

  doc = new Document(options({ ref: getter(() => this.ref) }));

  get id() {
    return this.options.id;
  }

  get ref() {
    if (!this.id) {
      return;
    }
    return doc(collection(firebase.firestore, 'projects'), this.id);
  }

  deps = [this.doc];

  mount() {
    console.log('mount weird');
    return () => {
      console.log('unmount weird');
    };
  }
}

export type ProjectOptions = {
  id: string;
};

export class Project implements Mountable {
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

  deps = [this.doc];

  mount() {
    console.log('mount project');
    return () => {
      console.log('unmount project');
    };
  }
}

export type AssetsOptions = {
  project: Project;
};

export class Assets implements Mountable {
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

  deps = [this.query, this.first];
}
