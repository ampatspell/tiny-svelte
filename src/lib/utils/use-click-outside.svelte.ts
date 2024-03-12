import type { VoidCallback } from '$lib/types/types';

export type ClickOutsideParameters = VoidCallback;

export const clickOutside = (node: HTMLElement, parameters: ClickOutsideParameters) => {
  const onClick = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!node.contains(target)) {
      e.stopPropagation();
      parameters();
    }
  };
  window.addEventListener('click', onClick, { capture: true });
  return {
    destroy: () => {
      window.removeEventListener('click', onClick, { capture: true });
    }
  };
};
