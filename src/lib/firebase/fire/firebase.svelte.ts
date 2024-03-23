import type { VoidCallback } from '$lib/types/types';
import type { SnapshotMetadata } from '@firebase/firestore';
import { Model } from './model.svelte';
import { LoadPromises, type LoadPromiseType } from './deferred.svelte';
import type { OptionsInput } from '$lib/utils/args';

export type FirebaseModelOptions = {
  isPassive?: boolean;
};

export type HasLoadPromises<T, E> = {
  promises: LoadPromises<T, E>;
};

export const load = async (models: HasLoadPromises<unknown, unknown>[], key: LoadPromiseType) => {
  await Promise.all(models.map((model) => model.promises[key]));
};

export abstract class FirebaseModel<O extends FirebaseModelOptions = FirebaseModelOptions> extends Model<O> {
  isLoading = $state(false);
  isLoaded = $state(false);
  error = $state<unknown>();
  isError = $derived.by(() => !!this.error);
  metadata = $state<SnapshotMetadata>();
  promises = new LoadPromises<typeof this, unknown>();
  isPassive: boolean;

  constructor(options: OptionsInput<O>) {
    super(options);
    this.isPassive = this.options.isPassive ?? false;
  }

  _onWillLoad(subscribe: boolean) {
    this.promises._onWillLoad();
    this.error = undefined;
    this.metadata = undefined;
    this.isLoading = true;
    if (!subscribe) {
      this.isLoaded = false;
    }
  }

  _onError(error: unknown) {
    this.isLoading = false;
    this.error = error;
    this.metadata = undefined;
    this.promises._onError(error);
  }

  _onDidLoad(metadata: SnapshotMetadata) {
    this.isLoading = false;
    this.isLoaded = true;
    this.error = undefined;
    this.metadata = metadata;
    this.promises._onDidLoad(this, metadata.fromCache ? 'cached' : 'remote');
  }

  abstract _subscribeActive(): VoidCallback;

  subscribe() {
    if (this.isPassive) {
      return;
    }
    return this._subscribeActive();
  }
}
