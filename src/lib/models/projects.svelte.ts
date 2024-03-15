import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Model, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import type { ProjectData } from '$lib/types/project';
import type { EmptyObject } from '$lib/types/types';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, orderBy, query } from '@firebase/firestore';

export type ProjectModelOptions = {
  projects: ProjectsModel;
  doc: Document<ProjectData>;
};

export class ProjectModel extends Model<ProjectModelOptions> {
  doc = $derived(this.options.doc);
  id = $derived(this.doc.id);
  identifier = $derived(this.doc.data!.identifier);
  serialized = $derived(serialized(this, ['id', 'identifier']));
}

export class ProjectsModel extends ActivatableModel<EmptyObject> {
  collection = $derived(collection(firebase.firestore, 'projects'));
  direction = $state<'asc' | 'desc'>('asc');

  query = new QueryAll<ProjectData>(
    options({
      ref: getter(() => query(this.collection, orderBy('identifier', this.direction)))
    })
  );

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<ProjectData>) =>
        new ProjectModel({
          projects: this,
          doc
        })
    })
  );

  toggle() {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
  }

  dependencies = [this.query];
}
