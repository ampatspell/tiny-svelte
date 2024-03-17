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

  position = $state<Point>({ x: 0, y: 0 }); // derive from options.workspace
  pixel = $state<number>(2); // derive from options.workspace

  isBound = $state(false);
  size = $state<Size>({ width: 0, height: 0 });

  tool = new Tool();

  selected = $state<WorkspaceNodeModel>(); // wrap in existing
  dragging = $state<WorkspaceNodeModel>(); // wrap in existing
  resizing = $state<WorkspaceNodeModel>(); // wrap in existing

  select(node?: WorkspaceNodeModel) {
    if (this.selected === node) {
      return;
    }
    this.tool.set(ToolType.Idle);
    this.selected = node;
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

export enum Horizontal {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export enum Vertical {
  Top = 'top',
  Center = 'center',
  Bottom = 'bottom'
}

export type ResizeEvent = {
  horizontal: Horizontal;
  vertical: Vertical;
  position: Point;
  size: Size;
};

export type ResizeCallback = (event: ResizeEvent) => void;
