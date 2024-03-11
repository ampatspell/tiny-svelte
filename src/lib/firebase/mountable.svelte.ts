export type Loadable = {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error?: unknown;
};

export type Mountable = {
  mount?(): (() => void) | undefined;
  deps?: Mountable[];
};

export const activate = (model: Mountable) => {
  $effect(() => {
    return model.mount?.();
  });
  $effect(() => {
    const cancel = model.deps?.map((dep) => dep.mount?.());
    return () => cancel?.forEach((cancel) => cancel?.());
  });
};
