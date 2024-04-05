import type { ProjectAssetsModel } from './assets.svelte';
import type { AssetData, BoxAssetData, SceneAssetData, SceneLayerAssetData, SpriteAssetData } from '$lib/types/assets';
import { serialized } from '$lib/utils/object';
import type { Size } from '$lib/types/schema';
import { action } from '$lib/utils/action';
import type { ResizeEvent } from '$lib/types/types';
import { Model } from '$lib/firebase/fire/model.svelte';
import type { Document } from '$lib/firebase/fire/document.svelte';
import type { HasDelete } from '$components/basic/inspector/types';

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
  model: ProjectAssetModel,
): model is T & ProjectResizableAssetModel => {
  const resizable = model as unknown as T & ProjectResizableAssetModel;
  return resizable[ProjectResizableAssetToken] === true;
};

export type WithResizableAssetModelCallback<T extends ProjectAssetModel, R> = (
  model: T & ProjectResizableAssetModel,
) => R;

export const asResizableAssetModel = <T extends ProjectAssetModel, R>(
  model: T | undefined,
  cb: WithResizableAssetModelCallback<T, R>,
): R | undefined => {
  if (model && isResizableAssetModel(model)) {
    return cb(model);
  }
  return undefined;
};

export abstract class ProjectAssetModel<D extends AssetData = AssetData>
  extends Model<ProjectAssetModelOptions<D>>
  implements HasDelete
{
  assets = $derived(this.options.assets);

  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data!);

  id = $derived(this._doc.id!);
  path = $derived(this._doc.path!);
  exists = $derived(this._doc.exists);

  type = $derived(this._data!.type);
  identifier = $derived(this._data!.identifier);

  abstract humanType: string;
  abstract humanShortDescription?: string;

  serialized = $derived(serialized(this, ['id', 'identifier', 'type']));

  onIdentifier(identifier: string) {
    this._data.identifier = identifier;
    this._doc.scheduleSave();
  }

  async delete() {
    await this._doc.delete();
  }
}

export abstract class ProjectResizableAssetModelImpl<D extends AssetData = AssetData>
  extends ProjectAssetModel<D>
  implements ProjectResizableAssetModel
{
  [ProjectResizableAssetToken] = true;

  abstract isResizable: boolean;
  abstract step: number;

  size = $derived(this._data.size);

  @action
  onSize(size: Size) {
    this._data.size = size;
    this._doc.scheduleSave();
  }

  @action
  onResize(event: ResizeEvent) {
    this._data.size = event.size;
    this._doc.scheduleSave();
  }
}

export class ProjectBoxAssetModel extends ProjectResizableAssetModelImpl<BoxAssetData> {
  color = $derived(this._data.color);

  humanType = 'Box';
  humanShortDescription = $derived(this.color ?? 'No color');

  isResizable = true;
  step = 1;

  @action
  onColor(color: string) {
    this._data.color = color;
    this._doc.scheduleSave();
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'type', 'color']));
}

export class ProjectSpriteAssetModel extends ProjectResizableAssetModelImpl<SpriteAssetData> {
  pixels = $derived(this._data.pixels);

  humanType = 'Sprite';
  humanShortDescription = $derived(`${this.size.width}x${this.size.height}`);

  isResizable = true;
  step = 1;

  onPixels(next: number[]) {
    this._data.pixels = next;
    this._doc.scheduleSave();
  }

  serialized = $derived(serialized(this, ['id', 'identifier', 'type']));
}

export class ProjectSceneAssetModel extends ProjectResizableAssetModelImpl<SceneAssetData> {
  humanType = 'Scene';
  humanShortDescription = $derived(`${this.size.width}x${this.size.height}`);

  isResizable = true;
  step = 1;
}

export class ProjectSceneLayerAssetModel extends ProjectResizableAssetModelImpl<SceneLayerAssetData> {
  humanType = 'Scene layer';
  humanShortDescription = $derived(`${this.size.width}x${this.size.height}`);

  isResizable = true;
  step = 1;
}
