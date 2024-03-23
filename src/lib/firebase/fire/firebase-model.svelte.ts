import type { VoidCallback } from '$lib/types/types';
import type { SnapshotMetadata } from '@firebase/firestore';
import { Model } from './model.svelte';
import { LoadPromises } from './deferred.svelte';

export type FirebaseModelOptions = {
  isPassive?: boolean;
};

export abstract class FirebaseModel<O extends FirebaseModelOptions = FirebaseModelOptions> extends Model<O> {
  isLoading = $state(false);
  isLoaded = $state(false);
  error = $state<unknown>();
  isError = $derived.by(() => !!this.error);
  metadata = $state<SnapshotMetadata>();
  promises = new LoadPromises<typeof this, unknown>();

  onWillLoad(subscribe: boolean) {
    this.promises._onWillLoad();
    this.error = undefined;
    this.metadata = undefined;
    this.isLoading = true;
    if (!subscribe) {
      this.isLoaded = false;
    }
  }

  onError(error: unknown) {
    this.isLoading = false;
    this.error = error;
    this.metadata = undefined;
    this.promises._onError(error);
  }

  onDidLoad(metadata: SnapshotMetadata) {
    this.isLoading = false;
    this.isLoaded = true;
    this.error = undefined;
    this.metadata = metadata;
    this.promises._onDidLoad(this, metadata.fromCache ? 'cached' : 'remote');
  }

  abstract subscribeNonPassive(): VoidCallback;

  subscribe() {
    if (this.options.isPassive) {
      return;
    }
    return this.subscribeNonPassive();
  }
}
