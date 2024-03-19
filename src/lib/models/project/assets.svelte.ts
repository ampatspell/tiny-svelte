import { ActivatableModel, Document, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection, doc, setDoc } from '@firebase/firestore';
import type { ProjectModel } from './project.svelte';
import type { AssetData, BoxAssetData } from '$lib/types/assets';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { ProjectBoxAssetModel, type ProjectAssetModel } from './asset.svelte';

export type ProjectAssetsModelOptions = {
  project: ProjectModel;
};

export class ProjectAssetsModel extends ActivatableModel<ProjectAssetsModelOptions> {
  project = $derived(this.options.project);

  ref = $derived(collection(this.project.ref, 'assets'));
  id = $derived(this.ref.id);
  path = $derived(this.ref.path);

  _query = new QueryAll<AssetData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  _all = new Models<Document<AssetData>, ProjectAssetModel<AssetData>>(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<AssetData>) => {
        const type = doc.data?.type;
        if (type) {
          if (type === 'box') {
            return new ProjectBoxAssetModel({ assets: this, doc });
          }
          throw new Error(`unsupported asset type '${type}'`);
        }
      }
    })
  );

  all = $derived(this._all.content);

  assetByIdentifier(identifier: string) {
    return this.all.find((asset) => asset?.identifier === identifier);
  }

  async create(type: 'box') {
    if (type === 'box') {
      // TODO: new Document().save()
      const data: BoxAssetData = {
        identifier: 'new',
        type: 'box',
        size: { width: 8, height: 8 },
        color: 'white'
      };
      const ref = doc(this.ref);
      await setDoc(ref, data);
      return this._all.waitFor((model) => model.id === ref.id);
    }
  }

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['id']));
}
