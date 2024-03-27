import { Model } from '$lib/firebase/fire/model.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { getter } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';

import type { ProjectAssetModel } from '../asset.svelte';
import type { ProjectAssetsModel } from '../assets.svelte';
import { WorkspaceAssetModel } from './asset.svelte';
import type { WorkspaceModel } from './workspace.svelte';

export type WorkspaceAssetsModelOptions = {
  workspace: WorkspaceModel;
  assets: ProjectAssetsModel;
};

export class WorkspaceAssetsModel extends Model<WorkspaceAssetsModelOptions> {
  workspace = $derived(this.options.workspace);
  _assets = $derived(this.options.assets);

  _all = new MapModels({
    source: getter(() => this._assets.all),
    target: (asset: ProjectAssetModel) => new WorkspaceAssetModel({ assets: this, asset }),
  });

  all = $derived(this._all.content);

  nodeForAsset(asset: ProjectAssetModel) {
    return this.workspace.nodes.nodeForAsset(asset);
  }

  dependencies = [];

  async load() {}

  serialized = $derived(serialized(this, []));
}
