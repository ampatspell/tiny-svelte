import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
import type { Point, Size } from '$lib/types/schema';
import { action } from '$lib/utils/action';
import { getContext, setContext } from 'svelte';

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

export type WorkspaceContextOptions = {
  workspace: WorkspaceModel;
};

// TODO: replace with WorkspaceModel
export class WorkspaceContext {
  options: WorkspaceContextOptions;

  constructor(options: WorkspaceContextOptions) {
    this.options = options;
  }

  isBound = $state(false);
  size = $state<Size>({ width: 0, height: 0 });

  position = $state<Point>({ x: 0, y: 0 });
  pixel = $derived.by(() => this.options.workspace.pixel);

  tool = new Tool();

  selected = $derived.by(() => this.options.workspace.selectedNode.node);
  dragging = $state<WorkspaceNodeModel>(); // wrap in existing
  resizing = $state<WorkspaceNodeModel>(); // wrap in existing

  select(node?: WorkspaceNodeModel) {
    if (this.selected === node) {
      return;
    }
    this.tool.set(ToolType.Resize);
    this.options.workspace.selectNode(node);
  }

  isSelectedAndHasTools(model: WorkspaceNodeModel, types: ToolType[]) {
    return this.selected === model && types.includes(this.tool.type);
  }

  @action
  onPosition(position: Point) {
    this.position = position;
  }

  @action
  onResize(size: Size) {
    this.size = size;
  }
}

export const setWorkspaceContext = (model: WorkspaceContext) => {
  setContext('workspace', model);
};

export const getWorkspaceContext = () => {
  return getContext('workspace') as WorkspaceContext;
};
