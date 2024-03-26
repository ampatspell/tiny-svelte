import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import { WorkspaceNodeSelector, WorkspaceNodesModel } from './nodes.svelte';
import type { ProjectModel } from '../project.svelte';
import { WorkspaceAssetsModel } from './assets.svelte';
import { getter } from '$lib/utils/args';
import type { WorkspaceData } from '$lib/types/workspace';
import type { WorkspaceNodeModel } from './node.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { Document } from '$lib/firebase/fire/document.svelte';

export enum ToolType {
  WorkspaceDrag = 'workspace-drag',
  Idle = 'idle',
  Resize = 'resize',
  Edit = 'edit'
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
    ref: getter(() => this.ref)
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

  selectedNodeId = $state<string>();
  selectedNode = new WorkspaceNodeSelector({
    nodes: this.nodes,
    value: getter(() => this.selectedNodeId),
    select: (model: WorkspaceNodeModel, value: string) => model.id === value
  });

  selectNode(node?: WorkspaceNodeModel) {
    if (this.selectedNode.node === node) {
      return;
    }
    this.tool.set(ToolType.Idle);
    this.selectedNodeId = node?.id;
  }

  isNodeSelectedAndHasTools(model: WorkspaceNodeModel, types: ToolType[]) {
    return this.selectedNode.node === model && types.includes(this.tool.type);
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
