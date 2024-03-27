import type { Point } from '$lib/types/schema';

export const mouseClientPositionToPoint = (e: MouseEvent): Point => ({
  x: e.clientX,
  y: e.clientY
});

export const stopPropagation =
  <T extends Event>(fn: (e: T) => void) =>
  (e: T) => {
    e.stopPropagation();
    return fn(e);
  };

export const getActiveHTMLElement = () => {
  const el = document.activeElement;
  if (el instanceof HTMLElement) {
    return el;
  }
};

export const blurActiveElement = () => {
  const el = getActiveHTMLElement();
  el?.blur();
};

export const activeInputElement = () => {
  const el = getActiveHTMLElement();
  if (el instanceof HTMLInputElement) {
    return el;
  }
  if (el instanceof HTMLTextAreaElement) {
    return el;
  }
};
