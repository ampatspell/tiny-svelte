import type { Callback, Point } from '$lib/types';
import { mouseClientPositionToPoint } from './event';
import { dividePoint, roundPoint, subtractPoints } from './math';

export enum DraggableAxis {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Both = 'both'
}

export type DraggableParameters = {
  isDraggable: boolean;
  position?: Point;
  pixel: number;
  axis?: DraggableAxis;
  onShouldStart?: () => boolean;
  onStart?: Callback;
  onPosition: (position: Point) => void;
  onEnd?: Callback;
  onDragging?: (dragging: boolean) => void;
};

type Dragging = {
  position: Point;
  window: Point;
  pixel: number;
};

export const draggable = (node: HTMLElement, parameters: DraggableParameters) => {
  let dragging: Dragging | undefined;
  let isOver = false;

  const mouseOver = () => (isOver = true);
  const mouseOut = () => (isOver = false);

  const mouseDown = (e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    if (!isOver) {
      return;
    }
    if (!parameters.onShouldStart?.() && !parameters.isDraggable) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    dragging = {
      position: parameters.position ?? { x: 0, y: 0 },
      window: mouseClientPositionToPoint(e),
      pixel: parameters.pixel
    };

    parameters.onStart?.();
    parameters.onDragging?.(true);
  };

  const mouseUp = (e: MouseEvent) => {
    if (!dragging) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    dragging = undefined;

    parameters.onEnd?.();
    parameters.onDragging?.(false);
  };

  const mouseMove = (e: MouseEvent) => {
    if (!dragging) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const axis = parameters.axis ?? DraggableAxis.Both;
    const client = mouseClientPositionToPoint(e);
    const delta = dividePoint(subtractPoints(client, dragging.window), dragging.pixel);

    let point = {
      x: dragging.position.x,
      y: dragging.position.y
    };

    if (axis === DraggableAxis.Horizontal || axis === DraggableAxis.Both) {
      point.x += delta.x;
    }

    if (axis == DraggableAxis.Vertical || axis === DraggableAxis.Both) {
      point.y += delta.y;
    }

    point = roundPoint(point);

    parameters.onPosition(point);
  };

  const blur = () => {
    if (!dragging) {
      return;
    }

    dragging = undefined;

    parameters.onEnd?.();
    parameters.onDragging?.(false);
  };

  node.addEventListener('mousedown', mouseDown);
  node.addEventListener('mouseover', mouseOver);
  node.addEventListener('mouseout', mouseOut);

  window.addEventListener('mouseup', mouseUp);
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('blur', blur);

  return {
    update: (next: DraggableParameters) => (parameters = next),
    destroy: () => {
      node.removeEventListener('mousedown', mouseDown);
      node.removeEventListener('mouseover', mouseOver);
      node.removeEventListener('mouseout', mouseOut);

      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('blur', blur);
    }
  };
};
