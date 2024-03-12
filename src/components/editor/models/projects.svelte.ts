import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { getter, options } from '$lib/utils/args';
import { collection } from '@firebase/firestore';
import type { ProjectDocumentData } from './schema';
import { OrderBy } from './sorted.svelte';

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

export class ProjectsModel extends ActivatableModel {
  get collection() {
    return collection(firebase.firestore, 'projects');
  }

  orderBy = new OrderBy<ProjectDocumentData>({
    fields: ['identifier', 'name'],
    initial: 'identifier'
  });

  query = new QueryAll<ProjectDocumentData>(
    options({
      ref: getter(() => this.orderBy.apply(this.collection))
    })
  );

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<ProjectDocumentData>) => new ProjectModel(this, doc)
    })
  );

  dependencies = [this.query];
}
