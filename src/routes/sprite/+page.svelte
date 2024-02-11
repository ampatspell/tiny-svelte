<script lang="ts">
	import SpriteEditor from '$lib/sprite/sprite-editor.svelte';
	import Stage from '$lib/base/stage.svelte';
	import Layer from '$lib/base/layer.svelte';
	import Group from '$lib/base/group.svelte';

	let pixel = $state(32);
	let size = $state({ width: 9, height: 9 });
	let data = $state(new Array(size.width * size.height).fill(0));

	let onUpdated = (next: number[]) => {
		data = next;
	};

	let large = $derived.call(() => {
		return {
			width: size.width * pixel * 2,
			height: size.height * pixel + 1
		};
	});
</script>

<div class="page">
	<div class="stage">
		<Stage class="stage" size={large}>
			<Layer>
				<SpriteEditor {pixel} {size} {data} {onUpdated} />
				<Group position={{ x: size.width * pixel + 10, y: 10 }}>
					<SpriteEditor pixel={2} {size} {data} {onUpdated} />
				</Group>
			</Layer>
		</Stage>
	</div>
</div>

<style lang="scss">
	.page {
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		> .stage {
			:global(> .stage) {
				// outline: 1px solid red;
			}
		}
	}
</style>
