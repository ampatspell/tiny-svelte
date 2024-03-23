import type { VoidCallback } from '$lib/types/types';
import { tick } from 'svelte';

type UpdateFn<T> = (fn: (current: T) => T) => void;

type StartFn<T> = (update: UpdateFn<T>) => VoidCallback;

export default function readable<T>(initial_value: T, start: StartFn<T>) {
  let value = $state(initial_value);

  let subscribers = 0;
  let stop: VoidCallback | undefined;

  return {
    get value(): T {
      if ($effect.active()) {
        $effect(() => {
          if (subscribers++ === 0) {
            stop = start((fn) => {
              value = fn(value);
            });
          }
          return () => {
            tick().then(() => {
              if (--subscribers === 0) {
                stop?.();
                stop = undefined;
              }
            });
          };
        });
      }

      return value;
    }
  };
}

export const makeTimer = () => {
  return readable(0, (update) => {
    console.log('start');

    const interval = setInterval(() => update((current_value) => ++current_value), 1000);

    // update(value => value + 1);
    return () => {
      console.log('stop');

      clearInterval(interval);
    };
  });
};
