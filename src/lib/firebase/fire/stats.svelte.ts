import { untrack } from 'svelte';
import type { FirebaseModel, FirebaseModelOptions } from './firebase-model.svelte';
import type { HasSubscriber } from './subscriber.svelte';
import { removeObject } from '$lib/utils/array';

class Stats {
  subscribed = $state<HasSubscriber[]>([]);
  listening = $state<FirebaseModel<FirebaseModelOptions>[]>([]);

  registerSubscribed(model: HasSubscriber) {
    untrack(() => {
      this.subscribed.push(model);
    });
    return () => {
      untrack(() => {
        removeObject(this.subscribed, model);
      });
    };
  }

  registerListening(model: FirebaseModel<FirebaseModelOptions>) {
    untrack(() => {
      this.listening.push(model);
    });
    return () => {
      untrack(() => {
        removeObject(this.listening, model);
      });
    };
  }
}

export const stats = new Stats();
