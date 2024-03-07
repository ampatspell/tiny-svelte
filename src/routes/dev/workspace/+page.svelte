<script lang="ts">
	import Button from '$lib/editor/button.svelte';
	import type { Point, Size } from '$lib/types';
	import { type OnResizeEvent, WorkspaceModel, BoxNodeModel } from '$lib/workspace/model.svelte';
	import Workspace from '$lib/workspace/workspace.svelte';
	import BoxNode from './box-node.svelte';

	let workspace = new WorkspaceModel();

	type Box = { position: Point; size: Size; color: string };

	let boxes = $state([
		new BoxNodeModel({ position: { x: 3, y: 3 }, size: { width: 8, height: 8 }, color: 'red' }),
		new BoxNodeModel({ position: { x: 30, y: 10 }, size: { width: 8, height: 8 }, color: 'green' })
	]);

	let selected = $state<Box>();

	let onResize = (box: Box, { horizontal, vertical, position, size }: OnResizeEvent) => {
		// console.log(horizontal, vertical, position, size);
		box.position = position;
		box.size = size;
	};

	let onWorkspaceClick = () => {
		// console.log('onWorkspaceClick');
		selected = undefined;
	};

	let onBoxClick = (box: Box) => {
		// console.log('onBoxClick');
		selected = box;
	};

	let isWorkspaceDraggable = false;
</script>

{#snippet KeyValue(title: string, value: string)}
	<div class="row">
		<div class="title">{title}</div>
		<div class="value">{value}</div>
	</div>
{/snippet}

<div class="page">
	<Workspace
		class="workspace"
		isDraggable={isWorkspaceDraggable}
		model={workspace}
		onClick={onWorkspaceClick}
	>
		{#each boxes as box (box)}
			<BoxNode model={box} onClick={() => onBoxClick(box)} />
		{/each}
	</Workspace>

	<div class="sidebar">
		{@render KeyValue('Size', `${workspace.size.width} x ${workspace.size.height}px`)}
		{@render KeyValue('Position', `${workspace.position.x}, ${workspace.position.y}`)}

		<div class="row">
			<div class="title">Pixel ({workspace.pixel}px)</div>
			<div class="value">
				{#each [1, 2, 4, 8, 16] as value}
					<Button value={value.toString()} onClick={() => (workspace.pixel = value)} />
				{/each}
			</div>
		</div>

		{@render KeyValue('Selected', `${selected?.color ?? 'No selection'}`)}

		{#each boxes as box (box)}
			{@render KeyValue(
				`Box "${box.color}"`,
				`${box.position.x},${box.position.y} / ${box.size.width}x${box.size.height}`
			)}
		{/each}
	</div>
</div>

<style lang="scss">
	.page {
		flex: 1;
		display: flex;
		flex-direction: row;
		:global(> .workspace) {
			flex: 1;
		}
		> .sidebar {
			width: 250px;
			border-left: 1px solid fade-out(#000, 0.95);
			display: flex;
			flex-direction: column;
		}
	}

	.row {
		padding: 10px;
		border-bottom: 1px solid fade-out(#000, 0.95);
		display: flex;
		flex-direction: column;
		gap: 2px;
		> .title {
			font-weight: 600;
		}
		> .value {
			display: flex;
			flex-direction: row;
			gap: 1px;
		}
	}
</style>
