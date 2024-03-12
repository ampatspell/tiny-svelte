import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import type { ProjectData } from '$lib/types/project';
import { getter, options } from '$lib/utils/args';
import { collection } from '@firebase/firestore';

export class ProjectModel {
  projects: ProjectsModel;
  doc: Document<ProjectData>;

  constructor(projects: ProjectsModel, doc: Document<ProjectData>) {
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

  query = new QueryAll<ProjectData>(
    options({
      ref: getter(() => this.collection)
    })
  );

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<ProjectData>) => new ProjectModel(this, doc)
    })
  );

  dependencies = [this.query];
}
