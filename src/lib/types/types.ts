import type { Point, Size } from './schema';

export type Nullable<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;
export type VoidCallback = () => void;
export type OptionalVoidCallback = (() => void) | undefined;

export enum Horizontal {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum Vertical {
  Top = 'top',
  Center = 'center',
  Bottom = 'bottom',
}

export type ResizeEvent = {
  horizontal: Horizontal;
  vertical: Vertical;
  position: Point;
  size: Size;
};

export type ResizeCallback = (event: ResizeEvent) => void;
