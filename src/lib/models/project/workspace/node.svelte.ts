import type { ResizeEvent } from '$components/workspace/content/model.svelte';
import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { Point } from '$lib/types/schema';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { action } from '$lib/utils/action';
import { serialized } from '$lib/utils/object';
import type { ProjectAssetModel } from '../asset.svelte';
import type { WorkspaceNodesModelOptions } from './nodes.svelte';

type AssetByIdentifier = (identifier: string) => ProjectAssetModel | undefined;

export type WorkspaceNodeModelOptions = {
  nodes: WorkspaceNodesModelOptions;
  doc: Document<WorkspaceNodeData>;
  asset: AssetByIdentifier;
};

export class WorkspaceNodeModel extends Model<WorkspaceNodeModelOptions> {
  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data!);

  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  position = $derived(this._data.position);
  pixel = $derived(this._data.pixel);
  identifier = $derived(this._data.asset);

  asset = $derived(this.options.asset(this.identifier));

  // TODO: this can be removed from here. use node.asset
  isResizable = $derived(this.asset?.isResizable ?? false);
  size = $derived(this.asset?.size);
  resizeStep = $derived(this.asset?.resizeStep);

  @action
  onPosition(position: Point) {
    this._data.position = position;
    this._doc.scheduleSave();
  }

  @action
  onResize(event: ResizeEvent) {
    this._data.position = event.position;
    this._doc.scheduleSave();

    const asset = this.asset;
    if (asset && asset.isResizable) {
      asset.onResize(event);
    }
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'asset']));
}
