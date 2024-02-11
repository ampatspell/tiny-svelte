<script lang="ts">
	import { type Snippet } from "svelte";
	import { StageContext, setStageContext } from "./models.svelte";
	import { objectToStyle, sizeToStyleObject } from "../style.svelte";

  let { children, onStage } = $props<{
    children?: Snippet;
    onStage?: (stage: StageContext) => void;
  }>();

  let stage = new StageContext();
  setStageContext(stage);
  onStage?.(stage);

  let style = $derived(objectToStyle(sizeToStyleObject(stage!.size)));
</script>

<div class="stage" {style}>
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .stage {
    background: #fff;
    position: relative;
  }
</style>
