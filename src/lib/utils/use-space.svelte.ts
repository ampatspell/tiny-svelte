import { blurActiveElement } from './event';

export type SpaceProperties = {
  onSpace: (space: boolean) => void;
};

export const space = (node: HTMLElement, properties: SpaceProperties) => {
  let isSpace = false;

  const keyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpace) {
      blurActiveElement();
      isSpace = true;
      properties.onSpace(true);
    }
  };

  const keyUp = () => {
    if (!isSpace) {
      return;
    }
    isSpace = false;
    properties.onSpace(false);
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
