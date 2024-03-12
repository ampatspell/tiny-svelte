import type { VoidCallback } from '$lib/types/types';
import { blurActiveElement } from './event';

export type SpaceProperties = {
  onSpaceDown: VoidCallback;
  onSpaceUp: VoidCallback;
};

export const space = (node: HTMLElement, properties: SpaceProperties) => {
  let isSpace = false;

  const keyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpace) {
      blurActiveElement();
      isSpace = true;
      properties.onSpaceDown();
    }
  };

  const keyUp = () => {
    if (!isSpace) {
      return;
    }
    isSpace = false;
    properties.onSpaceUp();
  };

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  window.addEventListener('focus', keyUp);

  return {
    update: (next: SpaceProperties) => (properties = next),
    destroy: () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('focus', keyUp);
    }
  };
};
