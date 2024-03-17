import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection } from '@firebase/firestore';
import type { WorkspaceData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import type { ProjectModel } from '../project.svelte';
import { WorkspacesWorkspaceModel } from './workspace.svelte';

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

  _all = new Models(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<WorkspaceData>) => new WorkspacesWorkspaceModel({ workspaces: this, doc })
    })
  );

  all = $derived(this._all.content);

  serialized = $derived(serialized(this, ['path']));

  dependencies = [this._query, this._all];
}
