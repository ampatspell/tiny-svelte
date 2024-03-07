import type { Size } from '$lib/types';
import { getContext, setContext } from 'svelte';

const STAGE = 'canvas:stage';

export class StageContext {
  size = $state<Size>();
}

export const setStageContext = (context: StageContext) => {
  setContext(STAGE, context);
};

export const getStageContext = () => {
  return getContext(STAGE) as StageContext;
};
