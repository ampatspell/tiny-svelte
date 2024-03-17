import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { serialized } from '$lib/utils/object';
import type { ProjectAssetModel } from './asset.svelte';
import type { WorkspaceNodesModelOptions } from './nodes.svelte';

export type AssetByIdentifier = (identifier: string) => ProjectAssetModel | undefined;

export type WorkspaceNodeModelOptions = {
  nodes: WorkspaceNodesModelOptions;
  doc: Document<WorkspaceNodeData>;
  asset: AssetByIdentifier;
};

export class WorkspaceNodeModel extends Model<WorkspaceNodeModelOptions> {
  _doc = $derived(this.options.doc);
  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  position = $derived(this._doc.data!.position);
  assetIdentifier = $derived(this._doc.data!.asset);

  asset = $derived(this.options.asset(this.assetIdentifier));

  serialized = $derived(serialized(this, ['id', 'assetIdentifier', 'asset']));
}
