import type { ResizeEvent } from '$components/workspace/content/model.svelte';
import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { Point } from '$lib/types/schema';
import type { WorkspaceNodeData } from '$lib/types/workspace';
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
  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  position = $derived(this._doc.data!.position);
  pixel = $derived(this._doc.data!.pixel);
  identifier = $derived(this._doc.data!.asset);

  asset = $derived(this.options.asset(this.identifier));

  size = { width: 8, height: 8 };
  step = 1;

  onPosition(position: Point) {
    console.log('onPosition', position);
  }
  onResize(event: ResizeEvent) {
    console.log('onResize', event);
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'asset']));
}
