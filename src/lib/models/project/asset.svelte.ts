import type { ProjectAssetsModel } from './assets.svelte';
import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { AssetData, BoxAssetData } from '$lib/types/assets';
import { serialized } from '$lib/utils/object';
import type { ResizeEvent } from '$components/workspace/content/model.svelte';
import type { Size } from '$lib/types/schema';

export type ProjectAssetModelOptions<D extends AssetData> = {
  assets: ProjectAssetsModel;
  doc: Document<D>;
};

export abstract class ProjectAssetModel<D extends AssetData = AssetData> extends Model<ProjectAssetModelOptions<D>> {
  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data!);

  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  type = $derived(this._data!.type);
  identifier = $derived(this._data!.identifier);

  abstract isResizable: boolean;
  abstract size?: Size;
  abstract resizeStep: number;
  abstract onResize(event: ResizeEvent): void;

  serialized = $derived(serialized(this, ['id', 'identifier', 'type']));
}

export class ProjectBoxAssetModel extends ProjectAssetModel<BoxAssetData> {
  size = $derived(this._data.size);
  color = $derived(this._data.color);

  isResizable = true;
  resizeStep = 1;

  onResize(event: ResizeEvent): void {
    this._data.size = event.size;
    this._doc.scheduleSave();
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'type', 'size', 'color']));
}
