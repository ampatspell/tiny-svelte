import type { Point } from '$lib/types';
import { mouseClientPositionToPoint } from './event';
import { addPoints, dividePoint, pointEquals, floorPoint, subtractPoints } from './math';

export enum DraggableAxis {
	Horizontal = 'horizontal',
	Vertical = 'vertical',
	Both = 'both'
}

export type DraggableParameters = {
	isDraggable: boolean;
	position: Point;
	pixel: number;
	axis?: DraggableAxis;
	onStart?: () => void;
	onPosition: (position: Point) => void;
	onEnd?: () => void;
};

type Dragging = {
	position: Point;
	window: Point;
	pixel: number;
};

export const draggable = (node: HTMLElement, parameters: DraggableParameters) => {
	let dragging: Dragging | undefined;
	let isOver = false;

	const getAxis = () => parameters.axis ?? DraggableAxis.Both;

	const mouseOver = () => (isOver = true);
	const mouseOut = () => (isOver = false);

	const mouseDown = (e: MouseEvent) => {
		if (e.button !== 0 || !isOver || !parameters.isDraggable) {
			return;
		}

		e.stopPropagation();

		dragging = {
			position: parameters.position,
			window: mouseClientPositionToPoint(e),
			pixel: parameters.pixel
		};

		parameters.onStart?.();
	};

	const mouseUp = (e: MouseEvent) => {
		if (!dragging) {
			return;
		}
		e.stopPropagation();
		dragging = undefined;
		parameters.onEnd?.();
	};

	const mouseMove = (e: MouseEvent) => {
		if (!dragging) {
			return;
		}
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

		point = floorPoint(point);

		if (!pointEquals(parameters.position, point)) {
			parameters.onPosition(point);
		}
	};

	const blur = () => {
		if (!dragging) {
			return;
		}
		dragging = undefined;
		parameters.onEnd?.();
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
