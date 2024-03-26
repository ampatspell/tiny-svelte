import { collection, doc } from '@firebase/firestore';
import type { WorkspaceModel } from './workspace.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options, type OptionsInput } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { WorkspaceNodeModel } from './node.svelte';
import type { ProjectAssetModel } from '../asset.svelte';
import type { AssetType } from '$lib/types/assets';
import { ExistingSelector } from '$lib/models/selector.svelte';
import { QueryAll } from '$lib/firebase/fire/query.svelte';
import { MapModels } from '$lib/firebase/fire/models.svelte';
import { Document } from '$lib/firebase/fire/document.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';

export type WorkspaceNodeSelectorOptions<I> = {
  nodes: WorkspaceNodesModel;
  value: I | undefined;
  select: (model: WorkspaceNodeModel, value: I) => boolean;
};

export class WorkspaceNodeSelector<I> extends Model<WorkspaceNodeSelectorOptions<I>> {
  selector: ExistingSelector<I, WorkspaceNodeModel>;

  constructor(opts: OptionsInput<WorkspaceNodeSelectorOptions<I>>) {
    super(opts);
    this.selector = new ExistingSelector({
      models: getter(() => this.options.nodes.all),
      value: getter(() => this.options.value),
      select: getter(() => this.options.select)
    });
  }

  value = $derived.by(() => this.selector.value);
  node = $derived.by(() => this.selector.model);

  serialized = $derived(serialized(this, ['value', 'node']));
}

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends Model<WorkspaceNodesModelOptions> {
  workspace = $derived(this.options.workspace);
  project = $derived(this.workspace.project);
  assets = $derived(this.project.assets);

  ref = $derived(collection(this.workspace.ref, 'nodes'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  _all = new MapModels(
    options({
      source: getter(() => this._query.content),
      target: (doc: Document<WorkspaceNodeData>) => {
        return new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assets.assetByIdentifier(identifier)
        });
      }
    })
  );

  all = $derived(this._all.content);

  nodeForAsset(asset: ProjectAssetModel) {
    return this.all.find((node) => node.asset === asset);
  }

  async createNewAsset(type?: AssetType) {
    let asset: ProjectAssetModel | undefined;
    if (type) {
      asset = await this.project.assets.create(type);
    }

    const document = new Document<WorkspaceNodeData>({
      ref: doc(this.ref),
      data: {
        pixel: 2,
        position: { x: 10, y: 10 },
        asset: asset?.identifier ?? ''
      }
    });

    await document.save();
    return await this._all.waitFor((model) => model.id === document.id);
  }

  dependencies = [this._query];

  async load() {
    await this._query.promises.cached;
  }

  serialized = $derived(serialized(this, ['path']));
}
