import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection } from '@firebase/firestore';
import type { WorkspaceModel } from './workspace.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { WorkspaceNodeModel } from './node.svelte';
import { serialized } from '$lib/utils/object';

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends ActivatableModel<WorkspaceNodesModelOptions> {
  workspace = $derived(this.options.workspace);
  project = $derived(this.workspace.project);
  assets = $derived(this.project.assets);

  ref = $derived(collection(this.workspace.ref, 'nodes'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  _all = new Models(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<WorkspaceNodeData>) =>
        new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assets.assetByIdentifier(identifier)
        })
    })
  );

  all = $derived(this._all.content);

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['path']));
}
