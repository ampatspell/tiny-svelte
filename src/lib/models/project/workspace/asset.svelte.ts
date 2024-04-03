import { Model } from '$lib/firebase/fire/model.svelte';
import { serialized } from '$lib/utils/object';

import type { ProjectAssetModel } from '../asset.svelte';
import type { WorkspaceAssetsModel } from './assets.svelte';

export type WorkspaceAssetModelOptions = {
  assets: WorkspaceAssetsModel;
  asset: ProjectAssetModel;
};

export class WorkspaceAssetModel extends Model<WorkspaceAssetModelOptions> {
  asset = $derived(this.options.asset);
  nodes = $derived(this.options.assets.nodesForAsset(this.asset));

  exists = $derived(this.asset.exists);

  serialized = $derived(serialized(this, ['asset']));
}
