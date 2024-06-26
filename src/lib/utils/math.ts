import type { Point, Size } from '$lib/types/schema';

export const calcPoint = (a: Point, fn: (value: number) => number): Point => {
  return {
    x: fn(a.x),
    y: fn(a.y),
  };
};

export const calcPoints = (a: Point, b: Point, fn: (a: number, b: number) => number): Point => {
  return {
    x: fn(a.x, b.x),
    y: fn(a.y, b.y),
  };
};

export const addPoints = (a: Point, b: Point): Point => calcPoints(a, b, (a, b) => a + b);
export const subtractPoints = (a: Point, b: Point): Point => calcPoints(a, b, (a, b) => a - b);

export const multiplyPoint = (a: Point, value: number): Point => calcPoint(a, (a) => a * value);
export const dividePoint = (a: Point, value: number): Point => calcPoint(a, (a) => a / value);
export const roundPoint = (point: Point): Point => calcPoint(point, (value) => Math.round(value));
export const floorPoint = (point: Point): Point => calcPoint(point, (value) => Math.floor(value));
export const stepPoint = (point: Point, step: number) => calcPoint(point, (value) => Math.round(value / step) * step);

export const pointEquals = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export const calcSizes = (a: Size, b: Size, fn: (a: number, b: number) => number): Size => {
  return {
    width: fn(a.width, b.width),
    height: fn(a.height, b.height),
  };
};

export const calcSize = (a: Size, fn: (value: number) => number): Size => {
  return {
    width: fn(a.width),
    height: fn(a.height),
  };
};

export const addSizes = (a: Size, b: Size): Size => calcSizes(a, b, (a, b) => a + b);
export const subtractSizes = (a: Size, b: Size): Size => calcSizes(a, b, (a, b) => a - b);

export const multiplySize = (a: Size, value: number): Size => calcSize(a, (a) => a * value);

export const zeroSize = (): Size => ({ width: 0, height: 0 });
