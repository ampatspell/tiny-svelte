import type { Size } from "$lib/types";
import { getContext, setContext } from "svelte"

export class StageContext {
  size = $state<Size>();
}

const STAGE = 'stage';

export const setStageContext = (stage: StageContext) =>{
  setContext(STAGE, stage);
}

export const getStageContext = () => {
  return getContext(STAGE) as StageContext;
}
