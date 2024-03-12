export type Nullable<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;
export type VoidCallback = () => void;
export type OptionalVoidCallback = (() => void) | undefined;
