import { ActivatableModel, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection } from '@firebase/firestore';
import type { ProjectModel } from './project.svelte';
import type { WorkspaceData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';

export type WorkspacesModelOptions = {
  project: ProjectModel;
};

export class WorkspacesModel extends ActivatableModel<WorkspacesModelOptions> {
  project = $derived(this.options.project);
  ref = $derived(collection(this.project.ref, 'workspaces'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  serialized = $derived(serialized(this, ['path']));

  dependencies = [this._query];
}
