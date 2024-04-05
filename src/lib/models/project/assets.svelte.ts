import { Document } from '$lib/firebase/fire/document.svelte';
import { load } from '$lib/firebase/fire/firebase.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { QueryAll } from '$lib/firebase/fire/query.svelte';
import {
  type SceneAssetData,
  type AssetData,
  type AssetType,
  type BoxAssetData,
  type SceneLayerAssetData,
  type SpriteAssetData,
} from '$lib/types/assets';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';

import {
  type ProjectAssetModel,
  ProjectBoxAssetModel,
  ProjectSpriteAssetModel,
  ProjectSceneAssetModel,
  ProjectSceneLayerAssetModel,
} from './asset.svelte';
import type { ProjectModel } from './project.svelte';
import { randomString } from '$lib/utils/string';

export type ProjectAssetsModelOptions = {
  project: ProjectModel;
};

export class ProjectAssetsModel extends Model<ProjectAssetsModelOptions> {
  project = $derived(this.options.project);

  ref = $derived(collection(this.project.ref, 'assets'));
  id = $derived(this.ref.id);
  path = $derived(this.ref.path);

  _query = new QueryAll<AssetData>(
    options({
      ref: getter(() => this.ref),
    }),
  );

  _all = new MapModels<Document<AssetData>, ProjectAssetModel<AssetData>>({
    source: getter(() => this._query.content),
    target: (doc: Document<AssetData>) => {
      const type = doc.data?.type;
      if (type) {
        if (type === 'box') {
          return new ProjectBoxAssetModel({ assets: this, doc: doc as Document<BoxAssetData> });
        } else if (type === 'sprite') {
          return new ProjectSpriteAssetModel({ assets: this, doc: doc as Document<SpriteAssetData> });
        } else if (type === 'scene') {
          return new ProjectSceneAssetModel({ assets: this, doc: doc as Document<SceneAssetData> });
        } else if (type === 'scene-layer') {
          return new ProjectSceneLayerAssetModel({ assets: this, doc: doc as Document<SceneLayerAssetData> });
        }
        throw new Error(`unsupported asset type '${type}'`);
      }
    },
  });

  all = $derived(this._all.content);

  assetByIdentifier(identifier: string) {
    return this.all.find((asset) => asset?.identifier === identifier);
  }

  async create(type: AssetType) {
    const ref = doc(this.ref);
    let document: Document<AssetData>;
    const identifier = randomString();
    if (type === 'box') {
      document = new Document<BoxAssetData>({
        ref,
        data: {
          type: 'box',
          identifier,
          size: { width: 8, height: 8 },
          color: 'white',
        },
      });
    } else if (type === 'sprite') {
      document = new Document<SpriteAssetData>({
        ref,
        data: {
          type: 'sprite',
          identifier,
          size: { width: 9, height: 8 },
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
      });
    } else if (type === 'scene') {
      document = new Document<SceneAssetData>({
        ref,
        data: {
          type: 'scene',
          identifier,
          size: { width: 128, height: 64 },
        },
      });
    } else if (type === 'scene-layer') {
      document = new Document<SceneLayerAssetData>({
        ref,
        data: {
          type: 'scene-layer',
          identifier,
          size: { width: 128, height: 64 },
        },
      });
    } else {
      throw new Error(`unsupported asset type ${type}`);
    }

    await document.save();
    return this._all.waitFor((model) => model.id === document.id);
  }

  dependencies = [this._query];

  async load() {
    await load(this.dependencies, 'cached');
  }

  serialized = $derived(serialized(this, ['id']));
}
