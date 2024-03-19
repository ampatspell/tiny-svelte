import type { ProjectAssetsModel } from './assets.svelte';
import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { AssetData, BoxAssetData } from '$lib/types/assets';
import { serialized } from '$lib/utils/object';
import type { ResizeEvent } from '$components/workspace/content/model.svelte';
import type { Size } from '$lib/types/schema';
import { action } from '$lib/utils/action';

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

  abstract humanType: string;
  abstract isResizable: boolean;
  abstract size?: Size;
  abstract resizeStep: number;
  abstract onResize(event: ResizeEvent): void;

  serialized = $derived(serialized(this, ['id', 'identifier', 'type']));

  onIdentifier(identifier: string) {
    this._data.identifier = identifier;
    this._doc.scheduleSave();
  }
}

export class ProjectBoxAssetModel extends ProjectAssetModel<BoxAssetData> {
  humanType = 'Box';

  size = $derived(this._data.size);
  color = $derived(this._data.color);

  isResizable = true;
  resizeStep = 1;

  @action
  onColor(color: string) {
    this._data.color = color;
    this._doc.scheduleSave();
  }

  onResize(event: ResizeEvent): void {
    this._data.size = event.size;
    this._doc.scheduleSave();
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'type', 'size', 'color']));
}
