<!-- <script lang="ts">
  import Button from '$components/basic/button.svelte';
  import Segment from '$components/basic/segmented/segment.svelte';
  import Segmented from '$components/basic/segmented/segmented.svelte';
  import { BoxModel, BoxNodeModel, ToolType, WorkspaceContext } from '$components/workspace/content/model.svelte';
  import Workspace from '$components/workspace/content/workspace.svelte';
  import BoxNode from './box-node.svelte';

  let workspace = new WorkspaceContext();

  let boxes = $state([
    new BoxNodeModel({
      position: { x: 3, y: 3 },
      size: { width: 8, height: 8 },
      pixel: 2,
      box: new BoxModel({ step: 1, color: 'red' })
    }),
    new BoxNodeModel({
      position: { x: 30, y: 10 },
      size: { width: 8, height: 8 },
      pixel: 2,
      box: new BoxModel({ step: 8, color: 'green' })
    })
  ]);
</script>

{#snippet KeyValue(title: string, value: string)}
  <div class="row">
    <div class="title">{title}</div>
    <div class="value">{value}</div>
  </div>
{/snippet}

<div class="page">
  <Workspace class="workspace" context={workspace}>
    {#each boxes as box (box)}
      <BoxNode model={box} />
    {/each}
  </Workspace>

  <div class="sidebar">
    {@render KeyValue('Size', `${workspace.size.width} x ${workspace.size.height}px`)}
    {@render KeyValue('Position', `${workspace.position.x}, ${workspace.position.y}`)}

    <div class="row">
      <div class="title">Workspace</div>
      <div class="value">
        <Segmented>
          {#each [1, 2, 4, 8, 16] as value}
            <Segment value="{value}px" isSelected={value === workspace.pixel} onClick={() => (workspace.pixel = value)} />
          {/each}
        </Segmented>
      </div>
    </div>

    {@render KeyValue('Tool', workspace.tool.type)}

    <div class="row">
      <div class="title">Tools</div>
      <div class="value">
        {#each [ToolType.Idle, ToolType.Resize] as value}
          <Button {value} onClick={() => workspace.tool.set(value)} />
        {/each}
      </div>
    </div>

    {@render KeyValue('Selected', `${workspace.selected?.name} ${workspace.selected?.description}`)}

    {#each boxes as box (box)}
      {@render KeyValue(`Box "${box.box.color}"`, `${box.position.x},${box.position.y} / ${box.size.width}x${box.size.height}`)}
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
</style> -->
