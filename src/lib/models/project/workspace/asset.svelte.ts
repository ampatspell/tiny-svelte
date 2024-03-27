import { Model } from '$lib/firebase/fire/model.svelte';
import { serialized } from '$lib/utils/object';

import type { ProjectAssetModel } from '../asset.svelte';
import type { WorkspaceAssetsModel } from './assets.svelte';

export type WorkspaceAssetModelOptions = {
  assets: WorkspaceAssetsModel;
  asset: ProjectAssetModel;
};

export class WorkspaceAssetModel extends Model<WorkspaceAssetModelOptions> {
  assets = $derived(this.options.assets);
  asset = $derived(this.options.asset);

  node = $derived(this.assets.nodeForAsset(this.asset));
  isVisible = $derived(!!this.node);

  serialized = $derived(serialized(this, ['isVisible', 'asset', 'node']));
}
