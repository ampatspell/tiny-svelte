import { getContext, setContext } from 'svelte';

class Layout {
	isEditing = $state(false);
	save = $state<() => Promise<void>>();

	onEditing(save: () => Promise<void>) {
		$effect.pre(() => {
			this.isEditing = true;
			this.save = save;
			return () => {
				this.isEditing = false;
				this.save = undefined;
			};
		});
	}
}

export const createLayout = () => {
	const layout = new Layout();
	setContext('layout', layout);
	return layout;
};

export const getLayout = () => {
	return getContext('layout') as Layout;
};
