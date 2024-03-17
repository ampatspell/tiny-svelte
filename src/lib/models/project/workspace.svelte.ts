import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import { WorkspaceNodesModel } from './nodes.svelte';
import { ActivatableModel } from '$lib/firebase/firestore.svelte';
import type { ProjectModel } from './project.svelte';

export type WorkspaceModelOptions = {
  project: ProjectModel;
  id: string;
};

export class WorkspaceModel extends ActivatableModel<WorkspaceModelOptions> {
  project = $derived(this.options.project);

  id = $derived(this.options.id);
  ref = $derived(doc(collection(this.project.ref, 'workspaces'), this.id));
  path = $derived(this.ref.path);

  nodes = new WorkspaceNodesModel({
    workspace: this
  });

  serialized = $derived(serialized(this, ['id']));

  dependencies = [this.project, this.nodes];
}
