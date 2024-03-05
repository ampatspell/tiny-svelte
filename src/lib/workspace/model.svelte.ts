import { type Point, type Size } from '$lib/types';
import { action } from '$lib/utils/action';
import { getContext, setContext } from 'svelte';

export class WorkspaceContext {
	size = $state<Size>({ width: 0, height: 0 });
	position = $state<Point>({ x: 10, y: 10 });
	pixel = $state<number>(8);

	@action
	onResize(size: Size) {
		this.size = size;
	}
}

export const setWorkspaceContext = (context: WorkspaceContext) => {
	setContext('workspace', context);
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

export type PinOnResize = (vertical: Vertical, horizontal: Horizontal, point: Point) => void;

export class PinModel {
	vertical: Vertical;
	horizontal: Horizontal;
	_onResize: PinOnResize;

	constructor(vertical: Vertical, horizontal: Horizontal, onResize: PinOnResize) {
		this.vertical = vertical;
		this.horizontal = horizontal;
		this._onResize = onResize;
	}

	@action
	onResize(point: Point) {
		this._onResize(this.vertical, this.horizontal, point);
	}
}
