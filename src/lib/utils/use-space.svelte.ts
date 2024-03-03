export type SpaceProperties = {
	onSpace: (space: boolean) => void;
};

export const space = (node: HTMLElement, properties: SpaceProperties) => {
	const keyDown = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			properties.onSpace(true);
		}
	};

	const keyUp = () => {
		properties.onSpace(false);
	};

	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyUp', keyUp);
	window.addEventListener('focus', keyUp);

	return {
		update: (next: SpaceProperties) => (properties = next),
		destroy: () => {
			window.removeEventListener('keydown', keyDown);
			window.removeEventListener('keyUp', keyUp);
			window.removeEventListener('focus', keyUp);
		}
	};
};
