import type { VoidCallback } from '$lib/types/types';
import { tick, untrack } from 'svelte';
import { stats } from './stats.svelte';

export type HasSubscriber = {
  subscriber: Subscriber;
  subscribe(): (() => void) | void;
  dependencies?: HasSubscriber[];
};

export class Subscriber {
  _model: HasSubscriber;
  _subscribers = 0;
  _cancel?: VoidCallback;

  constructor(model: HasSubscriber) {
    this._model = model;
  }

  get _dependencies() {
    return this._model.dependencies ?? [];
  }

  _subscribe() {
    const children = this._dependencies.map((child) => child.subscriber.subscribe());
    const self = this._model.subscribe();
    const stat = stats._registerSubscribed(this._model);
    return () => {
      self?.();
      children.forEach((child) => child());
      stat();
    };
  }

  _maybeSubscribe() {
    if (this._subscribers++ === 0) {
      this._cancel = this._subscribe();
    }
  }

  async _maybeCancel() {
    await tick();
    if (--this._subscribers === 0) {
      this._cancel!();
      this._cancel = undefined;
    }
  }

  subscribe() {
    this._maybeSubscribe();
    return () => {
      this._maybeCancel();
    };
  }
}

export const subscribe = (model: HasSubscriber) => {
  $effect.pre(() => {
    return untrack(() => {
      return model.subscriber.subscribe();
    });
  });
};
