import type { Point, Size } from '$lib/types/schema';
import type { Nullable } from '$lib/types/types';

type StyleObject = { [key: string]: Nullable<string> };

export const sizeToStyleObject = (size: Size): StyleObject => {
  const { width, height } = size;
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
};

export const positionToStyleObject = (position: Point): StyleObject => {
  const { x, y } = position;
  return {
    top: `${y}px`,
    left: `${x}px`,
  };
};

export const objectToStyle = (object: StyleObject) => {
  const arr = <string[]>[];
  for (const key of Object.keys(object)) {
    const value = object[key];
    if (value) {
      arr.push(`${key}: ${value}`);
    }
  }
  return arr.join('; ');
};
