import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
import type { ToolType, WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
import type { Point, Size } from '$lib/types/schema';
import { action } from '$lib/utils/action';
import { getContext, setContext } from 'svelte';

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
  dragging = $state<WorkspaceNodeModel>(); // wrap in existing
  resizing = $state<WorkspaceNodeModel>(); // wrap in existing

  workspace = $derived.by(() => this.options.workspace);
  pixel = $derived(this.workspace.pixel);
  tool = $derived(this.workspace.tool);
  selected = $derived(this.workspace.selectedNode.node);

  selectNode(node?: WorkspaceNodeModel) {
    this.workspace.selectNode(node);
  }

  isSelectedAndHasTools(model: WorkspaceNodeModel, types: ToolType[]) {
    return this.workspace.isNodeSelectedAndHasTools(model, types);
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
