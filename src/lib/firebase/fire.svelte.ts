import type { VoidCallback } from '$lib/types/types';
import { onSnapshot, type DocumentData, type DocumentReference, DocumentSnapshot } from '@firebase/firestore';
import { tick, untrack } from 'svelte';

export type Subscribable = {
  subscribe(): VoidCallback;
};

export type HasSubscriber = {
  subscriber: Subscriber;
}

export class Subscriber {
  _subscribable: Subscribable;
  _subscribers = 0;
  _cancel?: VoidCallback;

  constructor(subscribable: Subscribable) {
    this._subscribable = subscribable;
  }

  _maybeSubscribe() {
    console.log('_maybeSubscribe');
    if (this._subscribers++ === 0) {
      console.log('+subscriber');
      this._cancel = this._subscribable.subscribe();
    }
  }

  async _maybeCancel() {
    console.log('_maybeCancel');
    await tick();
    if (--this._subscribers === 0) {
      console.log('-subscriber');
      this._cancel!();
      this._cancel = undefined;
    }
  }

  subscribe() {
    // console.log('+subscriber subscribe');
    this._maybeSubscribe();
    return () => {
      // console.log('-subscriber subscribe');
      this._maybeCancel();
    };
  }
}

export type BaseOptions = {
  isPassive?: boolean;
};

export abstract class Base<O extends BaseOptions> implements Subscribable {
  subscriber = new Subscriber(this);
  options: O;

  constructor(options: O) {
    this.options = options;
  }

  abstract subscribe(): VoidCallback;
}

export type DocumentOptions = {
  ref: DocumentReference;
} & BaseOptions;

export class Document<T extends DocumentData = DocumentData> extends Base<DocumentOptions> {
  data = $state<T>();
  exists = $state<boolean>();
  isLoading = $state<boolean>(false);
  isLoaded = $state<boolean>(false);

  ref = $derived(this.options.ref);
  id = $derived(this.ref.id);
  path = $derived(this.ref.path);

  subscribe() {
    const root = $effect.root(() => {
      // console.log('+root');

      $effect.pre(() => {
        const ref = this.ref;
        // console.log('+doc', ref.path);

        untrack(() => {
          this.isLoading = true;
        })

        const cancel = onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => this.onSnapshot(snapshot));

        return () => {
          // console.log('-doc', ref.path);
          cancel();
        };
      });
    });

    return () => {
      // console.log('-root');
      root();
    };
  }

  onSnapshot(snapshot: DocumentSnapshot) {
    const exists = snapshot.exists();
    if (exists) {
      this.data = snapshot.data() as T;
    }
    this.exists = exists;
    this.isLoading = false;
    this.isLoaded = true;
  }
}

export const subscribe = (model: HasSubscriber) => {
  $effect(() => {
    return untrack(() => {
      return model.subscriber.subscribe();
    });
  });
}
