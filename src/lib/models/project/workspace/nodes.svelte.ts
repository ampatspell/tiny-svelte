import { ActivatableModel, Document, Model, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { collection, doc, setDoc } from '@firebase/firestore';
import type { WorkspaceModel } from './workspace.svelte';
import type { WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { WorkspaceNodeModel } from './node.svelte';
import type { ProjectAssetModel } from '../asset.svelte';
import type { AssetType } from '$lib/types/assets';
import { ExistingSelector } from '$lib/models/selector.svelte';

export type WorkspaceNodeSelectorOptions<I> = {
  nodes: WorkspaceNodesModel;
  value: I | undefined;
  select: (model: WorkspaceNodeModel, value: I) => boolean;
};

export class WorkspaceNodeSelector<I> extends Model<WorkspaceNodeSelectorOptions<I>> {
  selector: ExistingSelector<I, WorkspaceNodeModel>;

  constructor(_options: WorkspaceNodeSelectorOptions<I>) {
    super(_options);
    this.selector = new ExistingSelector(
      options({
        models: getter(() => _options.nodes.all),
        value: getter(() => _options.value),
        select: getter(() => _options.select)
      })
    );
  }

  value = $derived.by(() => this.selector.value);
  node = $derived.by(() => this.selector.model);

  serialized = $derived(serialized(this, ['value', 'node']));
}

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends ActivatableModel<WorkspaceNodesModelOptions> {
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

  _all = new Models(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<WorkspaceNodeData>) => {
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
    // TODO: new Document().save()
    const ref = doc(this.ref);
    const data: WorkspaceNodeData = {
      pixel: 2,
      position: { x: 10, y: 10 },
      asset: asset?.identifier ?? ''
    };
    await setDoc(ref, data);
    return await this._all.waitFor((model) => model.id === ref.id);
  }

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['path']));
}
