import { type Point, type Size } from '$lib/types';
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

export class WorkspaceModel {
  isBound = $state(false);
  size = $state<Size>({ width: 0, height: 0 });
  position = $state<Point>({ x: 0, y: 0 });
  pixel = $state<number>(8);
  tool = new Tool();
  selected = $state<NodeModel>();

  select(node?: NodeModel) {
    if (this.selected === node) {
      return;
    }
    this.tool.set(ToolType.Idle);
    this.selected = node;
  }

  @action
  onResize(size: Size) {
    this.size = size;
  }
}

export type NodeModel = {
  name: string;
  description?: string;
  position: Point;
  size: Size;
  pixel: number;
  step: number;

  onPosition(position: Point): void;
  onResize(event: OnResizeEvent): void;
};

export const setWorkspaceContext = (model: WorkspaceModel) => {
  setContext('workspace', model);
};

export const getWorkspaceContext = () => {
  return getContext('workspace') as WorkspaceModel;
};

//

export class BoxNodeModel implements NodeModel {
  position = $state<Point>()!;
  size = $state<Size>()!;
  color = $state<string>()!;
  pixel = $state<number>()!;
  step = 4;

  constructor(opts: Pick<BoxNodeModel, 'position' | 'size' | 'color' | 'pixel'>) {
    this.position = opts.position;
    this.size = opts.size;
    this.color = opts.color;
    this.pixel = opts.pixel;
  }

  name = 'Box';

  get description() {
    return `${this.size.width}x${this.size.height}, ${this.pixel}, ${this.color}`;
  }

  @action
  onPosition(position: Point) {
    this.position = position;
  }

  @action
  onResize(event: OnResizeEvent) {
    this.size = event.size;
  }
}

//

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

export type OnResizeEvent = {
  horizontal: Horizontal;
  vertical: Vertical;
  position: Point;
  size: Size;
};

export type OnResizeFn = (event: OnResizeEvent) => void;
