import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import { WorkspaceNodeSelector, WorkspaceNodesModel } from './nodes.svelte';
import { ActivatableModel, Document } from '$lib/firebase/firestore.svelte';
import type { ProjectModel } from '../project.svelte';
import { WorkspaceAssetsModel } from './assets.svelte';
import { getter, options } from '$lib/utils/args';
import type { WorkspaceData } from '$lib/types/workspace';
import type { WorkspaceNodeModel } from './node.svelte';

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

export class WorkspaceModel extends ActivatableModel<WorkspaceModelOptions> {
  project = $derived(this.options.project);

  id = $derived(this.options.id);
  ref = $derived(doc(collection(this.project.ref, 'workspaces'), this.id));
  path = $derived(this.ref.path);

  _doc = new Document<WorkspaceData>(
    options({
      ref: getter(() => this.ref)
    })
  );

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
  assets = new WorkspaceAssetsModel(options({ workspace: this, assets: getter(() => this.project.assets) }));

  //

  tool = new Tool();

  selectTool(tool: ToolType) {
    this.tool.set(tool);
  }

  //

  selectedNodeId = $state<string>();
  selectedNode = new WorkspaceNodeSelector(
    options({
      nodes: this.nodes,
      value: getter(() => this.selectedNodeId),
      select: (model: WorkspaceNodeModel, value: string) => model.id === value
    })
  );

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

  dependencies = [this._doc, this.project, this.nodes, this.assets];
}
