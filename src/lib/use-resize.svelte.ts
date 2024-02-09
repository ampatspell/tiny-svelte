import type { Size } from "./types";

export type ResizeParameters = {
  onResize: (size: Size) => void;
};

export const resize = (node: HTMLElement, parameters: ResizeParameters) => {
  const observer = new ResizeObserver((entries) => {
    const [ entry ] = entries;
    const { width, height } = entry.contentRect;
    parameters.onResize({ width, height });
  });
  observer.observe(node);
  return {
    destroy: () => {
      observer.unobserve(node);
    }
  };
};
