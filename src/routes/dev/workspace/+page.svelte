<script lang="ts">
	import Button from '$lib/editor/button.svelte';
	import type { Point } from '$lib/types';
	import { WorkspaceContext } from '$lib/workspace/model.svelte';
	import Node from '$lib/workspace/node.svelte';
	import Workspace from '$lib/workspace/workspace.svelte';

	let workspace = $state<WorkspaceContext>();

	let positionOne = $state<Point>({ x: 1, y: 1 });
	let positionTwo = $state<Point>({ x: 10, y: 10 });

	let size = $derived.by(() => {
		let px = workspace?.pixel;
		if (!px) {
			return;
		}
		return [`width: ${20 * px}px`, `height: ${10 * px}px`].join('; ');
	});
</script>

{#snippet KeyValue(title: string, value: string)}
	<div class="row">
		<div class="title">{title}</div>
		<div class="value">{value}</div>
	</div>
{/snippet}

<div class="page">
	<Workspace class="workspace" onCreated={(context) => (workspace = context)}>
		<Node name="Box #1" position={positionOne} onPosition={(next) => (positionOne = next)}>
			<div class="box one" style={size}></div>
		</Node>
		<Node name="Box #2" position={positionTwo} onPosition={(next) => (positionTwo = next)}>
			<div class="box two" style={size}></div>
		</Node>
	</Workspace>

	<div class="sidebar">
		{@render KeyValue('Size', `${workspace?.size.width} x ${workspace?.size.height}px`)}
		{@render KeyValue('Position', `${workspace?.position.x}, ${workspace?.position.y}`)}
		<div class="row">
			<div class="title">Pixel ({workspace?.pixel}px)</div>
			<div class="value">
				{#each [1, 2, 4, 8, 16] as value}
					<Button value={value.toString()} onClick={() => workspace!.pixel = value} />
				{/each}
			</div>
		</div>
		{@render KeyValue('Box', `${positionOne.x}, ${positionOne.y}`)}
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

	.box {
		&.one {
			background: fade-out(red, 0.9);
		}
		&.two {
			background: fade-out(green, 0.9);
		}
	}
</style>
