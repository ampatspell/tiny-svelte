import { ActivatableModel, Document, Model, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection, doc, setDoc } from '@firebase/firestore';
import type { WorkspaceModel } from './workspace.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { WorkspaceNodeModel } from './node.svelte';
import type { ProjectAssetModel } from '../asset.svelte';
import type { AssetType } from '$lib/types/assets';

export type WorkspaceNodeSelectorOptions<I> = {
  nodes: WorkspaceNodesModel;
  value: I | undefined;
  select: (model: WorkspaceNodeModel, value: I) => boolean;
};

export class WorkspaceNodeSelector<I> extends Model<WorkspaceNodeSelectorOptions<I>> {
  value = $derived(this.options.value);

  node = $derived.by(() => {
    const value = this.value;
    if (!value) {
      return;
    }
    const {
      options: { nodes, select }
    } = this;
    const node = nodes.all.find((node) => select(node, value));
    if (!node) {
      return;
    }
    if (!node.exists) {
      return;
    }
    return node;
  });

  serialized = $derived(serialized(this, ['value', 'node']));
}

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

  nodeForAsset(asset: ProjectAssetModel) {
    return this.all.find((node) => node.asset === asset);
  }

  async createNewAsset(type?: AssetType) {
    let asset: ProjectAssetModel | undefined;
    if (type) {
      asset = await this.project.assets.create(type);
    }
    // TODO: new Document().save()
    const ref = doc(this.ref);
    const data: WorkspaceNodeData = {
      pixel: 2,
      position: { x: 10, y: 10 },
      asset: asset?.identifier ?? ''
    };
    await setDoc(ref, data);
    return await this._all.waitFor((model) => model.id === ref.id);
  }

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['path']));
}
