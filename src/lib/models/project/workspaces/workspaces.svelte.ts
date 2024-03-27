import type { Document } from '$lib/firebase/fire/document.svelte';
import { load } from '$lib/firebase/fire/firebase.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { QueryAll } from '$lib/firebase/fire/query.svelte';
import type { WorkspaceData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection } from '@firebase/firestore';

import type { ProjectModel } from '../project.svelte';
import { WorkspacesWorkspaceModel } from './workspace.svelte';

export type WorkspacesModelOptions = {
  project: ProjectModel;
};

export class WorkspacesModel extends Model<WorkspacesModelOptions> {
  project = $derived(this.options.project);
  ref = $derived(collection(this.project.ref, 'workspaces'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceData>(
    options({
      ref: getter(() => this.ref),
    }),
  );

  _all = new MapModels({
    source: getter(() => this._query.content),
    target: (doc: Document<WorkspaceData>) => new WorkspacesWorkspaceModel({ workspaces: this, doc }),
  });

  all = $derived(this._all.content);

  serialized = $derived(serialized(this, ['path']));

  dependencies = [this._query];

  async load() {
    await load(this.dependencies, 'cached');
  }
}
