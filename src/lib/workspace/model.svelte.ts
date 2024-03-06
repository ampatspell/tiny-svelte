import { type Point, type Size } from '$lib/types';
import { action } from '$lib/utils/action';
import { getContext, setContext } from 'svelte';

export class WorkspaceContext {
	size = $state<Size>({ width: 0, height: 0 });
	position = $state<Point>({ x: 10, y: 10 });
	pixel = $state<number>(8);

	isWorkspaceDraggable = $state(false);
	isNodeDraggable = $derived(!this.isWorkspaceDraggable);
	isNodeResizable = $derived(!this.isWorkspaceDraggable);

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

export type OnResizeEvent = {
	horizontal: Horizontal;
	vertical: Vertical;
	position: Point;
	size: Size;
};

export type OnResizeFn = (event: OnResizeEvent) => void;
