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

export class WorkspaceContext {
  isBound = $state(false);
  size = $state<Size>({ width: 0, height: 0 });
  position = $state<Point>({ x: 0, y: 0 });
  pixel = $state<number>(8);
  tool = new Tool();
  selected = $state<WorkspaceNodeModel>();
  dragging = $state<WorkspaceNodeModel>();
  resizing = $state<WorkspaceNodeModel>();

  select(node?: WorkspaceNodeModel) {
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

export const setWorkspaceContext = (model: WorkspaceContext) => {
  setContext('workspace', model);
};

export const getWorkspaceContext = () => {
  return getContext('workspace') as WorkspaceContext;
};

//

export abstract class WorkspaceNodeModel {
  abstract name: string;
  abstract description?: string;
  abstract position: Point;
  abstract pixel: number;
  abstract size: Size;
  abstract step: number;

  abstract onPosition(position: Point): void;
  abstract onResize(event: ResizeEvent): void;
}

export class BoxModel {
  step = $state<number>()!;
  color = $state<string>()!;

  constructor(opts: Pick<BoxModel, 'step' | 'color'>) {
    this.step = opts.step;
    this.color = opts.color;
  }
}

export class BoxNodeModel implements WorkspaceNodeModel {
  position = $state<Point>()!;
  size = $state<Size>()!;
  pixel = $state<number>()!;
  box = $state<BoxModel>()!;

  constructor(opts: Pick<BoxNodeModel, 'position' | 'size' | 'pixel' | 'box'>) {
    this.position = opts.position;
    this.size = opts.size;
    this.pixel = opts.pixel;
    this.box = opts.box;
  }

  name = 'Box';

  get description() {
    return `${this.size.width}x${this.size.height}, ${this.pixel}, ${this.box.color}`;
  }

  step = $derived(this.box.step);

  @action
  onPosition(position: Point) {
    this.position = position;
  }

  @action
  onResize(event: ResizeEvent) {
    this.position = event.position;
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

export type ResizeEvent = {
  horizontal: Horizontal;
  vertical: Vertical;
  position: Point;
  size: Size;
};

export type ResizeCallback = (event: ResizeEvent) => void;
