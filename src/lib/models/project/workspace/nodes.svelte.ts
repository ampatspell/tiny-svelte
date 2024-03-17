import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection } from '@firebase/firestore';
import type { WorkspaceModel } from './workspace.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { WorkspaceNodeModel } from './node.svelte';
import type { ProjectAssetModel } from '../asset.svelte';

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
      model: (doc: Document<WorkspaceNodeData>) => {
        return new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assets.assetByIdentifier(identifier)
        });
      }
    })
  );

  all = $derived(this._all.content);

  orphans = $derived.by(() => {
    return this.all.filter((node) => !node.asset);
  });

  nodeForAsset(asset: ProjectAssetModel) {
    return this.all.find((node) => node.asset === asset);
  }

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['path']));
}
