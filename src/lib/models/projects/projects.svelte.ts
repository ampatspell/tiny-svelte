import type { Document } from '$lib/firebase/fire/document.svelte';
import { load } from '$lib/firebase/fire/firebase.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { QueryAll } from '$lib/firebase/fire/query.svelte';
import { firebase } from '$lib/firebase/firebase.svelte';
import type { ProjectData } from '$lib/types/project';
import type { EmptyObject } from '$lib/types/types';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, orderBy, query } from '@firebase/firestore';

import { ProjectsProjectModel } from './project.svelte';

export class ProjectsModel extends Model<EmptyObject> {
  collection = $derived(collection(firebase.firestore, 'projects'));

  _query = new QueryAll<ProjectData>(
    options({
      ref: getter(() => query(this.collection, orderBy('identifier'))),
    }),
  );

  _all = new MapModels({
    source: getter(() => this._query.content),
    target: (doc: Document<ProjectData>) => {
      return new ProjectsProjectModel({
        projects: this,
        doc,
      });
    },
  });

  all = $derived(this._all.content);

  dependencies = [this._query];

  async load() {
    await load(this.dependencies, 'cached');
  }

  serialized = $derived(serialized(this, []));
}
