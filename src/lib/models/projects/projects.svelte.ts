import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import type { ProjectData } from '$lib/types/project';
import type { EmptyObject } from '$lib/types/types';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, orderBy, query } from '@firebase/firestore';
import { ProjectModel } from './project.svelte';

export class ProjectsModel extends ActivatableModel<EmptyObject> {
  collection = $derived(collection(firebase.firestore, 'projects'));

  _query = new QueryAll<ProjectData>(
    options({
      ref: getter(() => query(this.collection, orderBy('identifier')))
    })
  );

  _all = new Models(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<ProjectData>) =>
        new ProjectModel({
          projects: this,
          doc
        })
    })
  );

  all = $derived(this._all.content);

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, []));
}
