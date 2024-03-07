import { type Point, type Size } from '$lib/types';
import { action } from '$lib/utils/action';
import { getContext, setContext } from 'svelte';

export class WorkspaceModel {
	isBound = $state(false);
	size = $state<Size>({ width: 0, height: 0 });
	position = $state<Point>({ x: 0, y: 0 });
	pixel = $state<number>(8);

	@action
	onResize(size: Size) {
		this.size = size;
	}
}

export const setWorkspaceContext = (model: WorkspaceModel) => {
	setContext('workspace', model);
};

export const getWorkspaceContext = () => {
	return getContext('workspace') as WorkspaceModel;
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

export type OnResizeEvent = {
	horizontal: Horizontal;
	vertical: Vertical;
	position: Point;
	size: Size;
};

export type OnResizeFn = (event: OnResizeEvent) => void;
