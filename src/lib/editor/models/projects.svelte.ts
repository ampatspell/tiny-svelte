import { firebase } from '$lib/firebase/firebase.svelte';
import { Query, Document, Models } from '$lib/firebase/firestore.svelte';
import type { Mountable } from '$lib/firebase/mountable.svelte';
import { getter, options } from '$lib/utils/args';
import { collection } from '@firebase/firestore';
import type { ProjectDocumentData } from './schema';

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

  all = new Models(
    options({
      source: () => this.query.content,
      model: (doc: Document<ProjectDocumentData>) => new ProjectModel(this, doc)
    })
  );

  deps = [this.query];
}
