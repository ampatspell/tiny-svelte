import { Document } from '$lib/firebase/fire/document.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { QueryAll } from '$lib/firebase/fire/query.svelte';
import type { AssetType } from '$lib/types/assets';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import type { ProjectAssetModel } from '../asset.svelte';
import { WorkspaceNodeModel } from './node.svelte';
import type { WorkspaceModel } from './workspace.svelte';

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends Model<WorkspaceNodesModelOptions> {
  workspace = $derived(this.options.workspace);
  project = $derived(this.workspace.project);
  assets = $derived(this.project.assets);

  ref = $derived(collection(this.workspace.ref, 'nodes'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref),
    }),
  );

  _all = new MapModels(
    options({
      source: getter(() => this._query.content),
      target: (doc: Document<WorkspaceNodeData>) => {
        return new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assets.assetByIdentifier(identifier),
        });
      },
    }),
  );

  all = $derived(this._all.content);

  nodesForAsset(asset: ProjectAssetModel) {
    return this.all.filter((node) => node.asset === asset);
  }

  async createNewNode(asset?: ProjectAssetModel) {
    const document = new Document<WorkspaceNodeData>({
      ref: doc(this.ref),
      data: {
        pixel: 2,
        position: { x: 10, y: 10 },
        asset: asset?.identifier ?? '',
      },
    });

    await document.save();
    return await this._all.waitFor((model) => model.id === document.id);
  }

  async createNewAsset(type?: AssetType) {
    let asset: ProjectAssetModel | undefined;
    if (type) {
      asset = await this.project.assets.create(type);
    }
    return await this.createNewNode(asset);
  }

  dependencies = [this._query];

  async load() {
    await this._query.promises.cached;
  }

  serialized = $derived(serialized(this, ['path']));
}
