import type { Point } from '$lib/types';
import { mouseClientPositionToPoint } from './event';
import { addPoints, dividePoint, pointEquals, roundPoint, subtractPoints } from './math';

export type DraggableParameters = {
	isDraggable: boolean;
	position: Point;
	pixel: number;
	onPosition: (position: Point) => void;
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
		if (e.button !== 0 || !isOver || !parameters.isDraggable) {
			return;
		}

		e.stopPropagation();

		dragging = {
			position: parameters.position,
			window: mouseClientPositionToPoint(e),
			pixel: parameters.pixel
		};
	};

	const mouseUp = (e: MouseEvent) => {
		if (!dragging) {
			return;
		}
		e.stopPropagation();
		dragging = undefined;
	};

	const mouseMove = (e: MouseEvent) => {
		if (!dragging) {
			return;
		}
		e.stopPropagation();
		const client = mouseClientPositionToPoint(e);
		const delta = dividePoint(subtractPoints(client, dragging.window), dragging.pixel);
		const point = roundPoint(addPoints(dragging.position, delta));
		if (!pointEquals(parameters.position, point)) {
			parameters.onPosition(point);
		}
	};

	const blur = () => {
		if (!dragging) {
			return;
		}
		dragging = undefined;
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
