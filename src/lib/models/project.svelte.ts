import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, QueryAll } from '$lib/firebase/firestore.svelte';
import type { ProjectData } from '$lib/types/project';
import type { WorkspaceData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';

export type WorkspacesModelOptions = {
  project: ProjectModel;
};

export class WorkspacesModel extends ActivatableModel {
  options: WorkspacesModelOptions;

  constructor(options: WorkspacesModelOptions) {
    super();
    this.options = options;
  }

  ref = $derived.by(() => collection(this.options.project.ref, 'workspaces'));

  query = new QueryAll<WorkspaceData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  dependencies = [this.query];
}

export type ProjectModelOptions = {
  id: string;
};

export class ProjectModel extends ActivatableModel {
  options: ProjectModelOptions;

  constructor(options: ProjectModelOptions) {
    super();
    this.options = options;
  }

  id = $derived.by(() => this.options.id);
  ref = $derived.by(() => doc(collection(firebase.firestore, 'projects'), this.id));

  doc = new Document<ProjectData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  workspaces = new WorkspacesModel({
    project: this
  });

  identifier = $derived.by(() => this.doc.data?.identifier);

  serialized = $derived.by(() => serialized(this, ['id', 'identifier']));

  dependencies = [this.doc, this.workspaces];
}
