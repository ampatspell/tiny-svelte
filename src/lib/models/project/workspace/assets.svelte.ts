import { ActivatableModel, Models } from '$lib/firebase/firestore.svelte';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import type { ProjectAssetModel } from '../asset.svelte';
import type { ProjectAssetsModel } from '../assets.svelte';
import { WorkspaceAssetModel as WorkspaceAssetModel } from './asset.svelte';
import type { WorkspaceModel } from './workspace.svelte';

export type WorkspaceAssetsModelOptions = {
  workspace: WorkspaceModel;
  assets: ProjectAssetsModel;
};

export class WorkspaceAssetsModel extends ActivatableModel<WorkspaceAssetsModelOptions> {
  workspace = $derived(this.options.workspace);
  _assets = $derived(this.options.assets);

  _all = new Models(
    options({
      source: getter(() => this._assets.all),
      model: (asset: ProjectAssetModel) => new WorkspaceAssetModel({ assets: this, asset })
    })
  );

  all = $derived(this._all.content);

  nodeForAsset(asset: ProjectAssetModel) {
    return this.workspace.nodes.nodeForAsset(asset);
  }

  dependencies = [this._all];

  serialized = $derived(serialized(this, []));
}
