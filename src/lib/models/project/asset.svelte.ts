import type { ProjectAssetsModel } from './assets.svelte';
import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { AssetData, BoxAssetData } from '$lib/types/assets';
import { serialized } from '$lib/utils/object';

export type ProjectAssetModelOptions<D extends AssetData> = {
  assets: ProjectAssetsModel;
  doc: Document<D>;
};

export abstract class ProjectAssetModel<D extends AssetData = AssetData> extends Model<ProjectAssetModelOptions<D>> {
  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data);

  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  identifier = $derived(this._data?.identifier);

  serialized = $derived(serialized(this, ['id', 'identifier']));
}

export class ProjectBoxAssetModel extends ProjectAssetModel<BoxAssetData> {}
