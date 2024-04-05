import { Document } from '$lib/firebase/fire/document.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import type { WorkspaceData } from '$lib/types/workspace';
import { getter } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import type { ProjectModel } from '../project.svelte';
import { WorkspaceAssetsModel } from './assets.svelte';
import { WorkspaceNodesModel } from './nodes.svelte';
import { WorkspaceNodeModel } from './node.svelte';
import type { WorkspaceAssetModel } from './asset.svelte';
import { exists } from '$lib/models/selector.svelte';
import type { ProjectAssetModel } from '../asset.svelte';

export type WorkspaceSelectable = WorkspaceNodeModel | WorkspaceAssetModel;

export type WorkspaceSelectableFactory<O extends WorkspaceSelectable> = {
  new (...args: never): O;
};

export class WorkspaceSelection {
  _selected = $state<WorkspaceSelectable>();

  selected = $derived(exists(this._selected));

  select(model?: WorkspaceSelectable) {
    this._selected = model;
  }

  byType<O extends WorkspaceSelectable>(factory: WorkspaceSelectableFactory<O>): O | undefined {
    const model = this._selected;
    if (model instanceof factory) {
      return model;
    }
  }
}

export enum ToolType {
  WorkspaceDrag = 'workspace-drag',
  Idle = 'idle',
  Resize = 'resize',
  Edit = 'edit',
}

export class Tool {
  type = $state(ToolType.Idle);

  set(type: ToolType) {
    this.type = type;
  }
}

export type WorkspaceModelOptions = {
  project: ProjectModel;
  id: string;
};

export class WorkspaceModel extends Model<WorkspaceModelOptions> {
  project = $derived(this.options.project);

  id = $derived(this.options.id);
  ref = $derived(doc(collection(this.project.ref, 'workspaces'), this.id));
  path = $derived(this.ref.path);

  _doc = new Document<WorkspaceData>({
    ref: getter(() => this.ref),
  });

  _data = $derived(this._doc.data!);
  identifier = $derived(this._data.identifier);
  pixel = $derived(this._data.pixel);

  onIdentifier(identifier: string) {
    this._data.identifier = identifier;
    this._doc.scheduleSave();
  }

  onPixel(pixel: number) {
    this._data.pixel = pixel;
    this._doc.scheduleSave();
  }

  nodes = new WorkspaceNodesModel({ workspace: this });
  assets = new WorkspaceAssetsModel({ workspace: this, assets: getter(() => this.project.assets) });

  //

  tool = new Tool();

  selectTool(tool: ToolType) {
    this.tool.set(tool);
  }

  //

  selection = new WorkspaceSelection();

  select(model?: WorkspaceSelectable) {
    if (this.selection.selected === model) {
      return;
    }
    this.selection.select(model);
    this.tool.set(ToolType.Idle);
  }

  isNodeSelectedAndHasTools(model: WorkspaceNodeModel, types: ToolType[]) {
    const selected = this.selection.byType(WorkspaceNodeModel);
    return selected === model && types.includes(this.tool.type);
  }

  //

  serialized = $derived(serialized(this, ['id', 'identifier']));

  dependencies = [this.project, this._doc, this.nodes, this.assets];

  async load() {
    const doc = this._doc.promises.cached;
    const project = this.project.load();
    const nodes = this.nodes.load();
    const assets = this.assets.load();
    await Promise.all([doc, project, nodes, assets]);
  }
}
