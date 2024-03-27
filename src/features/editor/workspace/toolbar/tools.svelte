<script lang="ts">
  import Segment from '$components/basic/segmented/segment.svelte';
  import Segmented from '$components/basic/segmented/segmented.svelte';
  import { ToolType, type WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import { getter, options } from '$lib/utils/args';

  let {
    workspace,
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let tool = (name: string, tool: ToolType, hasSelection?: () => boolean) =>
    options({
      value: name,
      isSelected: getter(() => workspace.tool.type === tool),
      onSelect: () => workspace.selectTool(tool),
      isDisabled: getter(() => {
        if (hasSelection) {
          return !hasSelection();
        }
        return false;
      }),
    });

  let hasSelection = () => !!workspace.selectedNode.node;
  let tools = [
    tool('Idle', ToolType.Idle),
    tool('Resize', ToolType.Resize, hasSelection),
    tool('Edit', ToolType.Edit, hasSelection),
  ];
</script>

<Segmented width={55}>
  {#each tools as tool (tool)}
    <Segment value={tool.value} isSelected={tool.isSelected} isDisabled={tool.isDisabled} onClick={tool.onSelect} />
  {/each}
</Segmented>
