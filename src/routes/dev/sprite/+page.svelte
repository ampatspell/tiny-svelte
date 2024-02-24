<script lang="ts">
	import SpriteEditor from '$lib/sprite/sprite-editor.svelte';
	import Stage from '$lib/base/stage.svelte';
	import Layer from '$lib/base/layer.svelte';
	import Group from '$lib/base/group.svelte';

	let { data: root } = $props();

	let data = $derived(root.sprite.data.pixels);
	let size = $derived(root.sprite.data.size);
	let pixel = $state(32);

	let onUpdated = (next: number[]) => {
		root.sprite.data.pixels = next;
	};

	let large = $derived.by(() => {
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
				// outline: 1px solid fade-out(red, 0.9);
			}
		}
	}
</style>
