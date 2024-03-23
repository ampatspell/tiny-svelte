import type { ProjectAssetsModel } from './assets.svelte';
import type { AssetData, BoxAssetData } from '$lib/types/assets';
import { serialized } from '$lib/utils/object';
import type { Size } from '$lib/types/schema';
import { action } from '$lib/utils/action';
import type { ResizeEvent } from '$lib/types/types';
import { Model } from '$lib/firebase/fire/model.svelte';
import type { Document } from '$lib/firebase/fire/document.svelte';

export type ProjectAssetModelOptions<D extends AssetData> = {
  assets: ProjectAssetsModel;
  doc: Document<D>;
};

const ProjectResizableAssetToken: unique symbol = Symbol('ResizableAssetToken');

export interface ProjectResizableAssetModel {
  [ProjectResizableAssetToken]: boolean;
  isResizable: boolean;
  size: Size;
  step: number;
  onResize(event: ResizeEvent): void;
}

export const isResizableAssetModel = <T extends ProjectAssetModel>(
  model: ProjectAssetModel
): model is T & ProjectResizableAssetModel => {
  const resizable = model as unknown as T & ProjectResizableAssetModel;
  return resizable[ProjectResizableAssetToken] === true;
};

export type WithResizableAssetModelCallback<T extends ProjectAssetModel, R> = (
  model: T & ProjectResizableAssetModel
) => R;

export const asResizableAssetModel = <T extends ProjectAssetModel, R>(
  model: T | undefined,
  cb: WithResizableAssetModelCallback<T, R>
): R | undefined => {
  if (model && isResizableAssetModel(model)) {
    return cb(model);
  }
  return undefined;
};

export abstract class ProjectAssetModel<D extends AssetData = AssetData> extends Model<ProjectAssetModelOptions<D>> {
  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data!);

  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  type = $derived(this._data!.type);
  identifier = $derived(this._data!.identifier);

  abstract humanType: string;
  abstract humanShortDescription?: string;

  serialized = $derived(serialized(this, ['id', 'identifier', 'type']));

  onIdentifier(identifier: string) {
    this._data.identifier = identifier;
    this._doc.scheduleSave();
  }
}

export class ProjectBoxAssetModel extends ProjectAssetModel<BoxAssetData> implements ProjectResizableAssetModel {
  [ProjectResizableAssetToken] = true;

  humanType = 'Box';

  size = $derived(this._data.size);
  color = $derived(this._data.color);

  humanShortDescription = $derived(this.color ?? 'No color');

  isResizable = true;
  step = 1;

  @action
  onSize(size: Size) {
    this._data.size = size;
    this._doc.scheduleSave();
  }

  @action
  onColor(color: string) {
    this._data.color = color;
    this._doc.scheduleSave();
  }

  @action
  onResize(event: ResizeEvent) {
    this._data.size = event.size;
    this._doc.scheduleSave();
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'type', 'size', 'color']));
}
