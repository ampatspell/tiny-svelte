import { firebase } from '$lib/firebase/firebase.svelte';
import { Query, Document } from '$lib/firebase/firestore.svelte';
import type { Mountable } from '$lib/firebase/mountable.svelte';
import { getter, options } from '$lib/utils/args';
import { collection } from '@firebase/firestore';

export type ProjectDocumentData = {
  identifier: string;
};

export class ProjectModel {
  projects: ProjectsModel;
  doc: Document<ProjectDocumentData>;

  constructor(projects: ProjectsModel, doc: Document<ProjectDocumentData>) {
    this.projects = projects;
    this.doc = doc;
  }

  id = $derived.by(() => this.doc.id);
  identifier = $derived.by(() => this.doc.data!.identifier);
}

export class ProjectsModel implements Mountable {
  get collection() {
    return collection(firebase.firestore, 'projects');
  }

  query = new Query<ProjectDocumentData>(
    options({
      query: getter(() => this.collection)
    })
  );

  deps = [this.query];

  // TODO: map
  all = $derived.by(() => this.query.content.map((doc) => new ProjectModel(this, doc)));
}
