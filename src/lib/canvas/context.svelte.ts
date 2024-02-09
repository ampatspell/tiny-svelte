import { getContext, setContext } from "svelte"

const CONTEXT_NAME = 'canvas';

class CanvasContext {
  canvas = $state<HTMLCanvasElement>();
}

export const createCanvasContext = () => {
  const context = new CanvasContext();
  setContext(CONTEXT_NAME, context);
  return context;
}

export const getCanvasContext= () => {
  return getContext(CONTEXT_NAME) as CanvasContext;
}
