export type Nullable<T> = T | null | undefined;

export type Size = { width: number; height: number };
export type Position = { x: number; y: number };
export type DrawFunction<T> = (ctx: CanvasRenderingContext2D, model: T) => void;
