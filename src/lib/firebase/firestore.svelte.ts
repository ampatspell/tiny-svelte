import { insertObjectAt, removeObject, removeObjectAt } from '$lib/utils/array';
import {
  FirestoreError,
  Query,
  QuerySnapshot,
  onSnapshot,
  type DocumentData,
  SnapshotMetadata,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  snapshotEqual
} from '@firebase/firestore';
import { untrack } from 'svelte';
import { description, serialized } from '$lib/utils/object';
import type { OptionalVoidCallback, VoidCallback } from '$lib/types/types';

export class Model {
  declare serialized?: Record<string, unknown>;
  description = $derived.by(() => description(this, this.serialized));

  toString() {
    return this.description ?? description(this, this.serialized);
  }
}

export interface Activators {
  activated: HasActivator[];
  subscribed: HasActivator[];
}

export class ActivatorsImpl implements Activators {
  activated = $state<HasActivator[]>([]);
  subscribed = $state<HasActivator[]>([]);

  registerActivated(model: HasActivator) {
    this.activated.push(model);
    return () => {
      removeObject(this.activated, model);
    };
  }

  registerSubscribed(model: HasActivator) {
    this.subscribed.push(model);
    return () => {
      removeObject(this.subscribed, model);
    };
  }
}

const _activators = new ActivatorsImpl();
export const activators: Activators = _activators;

export interface HasActivator {
  activator: Activator;
  description?: string;
  serialized?: unknown;
}

export abstract class ActivatableModel extends Model implements HasActivator {
  activator: Activator;
  isActivated = $derived.by(() => this.activator.isActivated);

  get isActivatedUntracked() {
    return untrack(() => this.isActivated);
  }

  constructor() {
    super();
    this.activator = new Activator({
      owner: () => this,
      activate: () => this.activate(),
      dependencies: () => this.dependencies
    });
  }

  dependencies: HasActivator[] = [];
  activate() {}
}

type OnActivateResult = (() => void) | void;
type OnActivate = () => OnActivateResult;

type ActivatorOptions = {
  owner: () => HasActivator;
  dependencies?: () => HasActivator[];
  activate?: OnActivate;
};

class Activator {
  private options: ActivatorOptions;
  private listeners = $state(0);

  isActivated = $derived(this.listeners > 0);

  constructor(options: ActivatorOptions) {
    this.options = options;
  }

  get dependencies() {
    return this.options.dependencies?.() ?? [];
  }

  get owner() {
    return this.options.owner();
  }

  private cancel: OnActivateResult | undefined;

  private onIncrement() {
    this.listeners++;
    if (this.listeners === 1) {
      const registration = _activators.registerActivated(this.owner);
      const activation = this.options.activate?.();
      this.cancel = () => {
        registration();
        activation?.();
      };
    }
  }

  private onDecrement() {
    this.listeners--;
    if (this.listeners === 0) {
      const cancel = this.cancel;
      if (cancel) {
        cancel();
        this.cancel = undefined;
      }
    }
  }

  increment() {
    this.onIncrement();
    const dependencies = this.dependencies.map((dep) => dep.activator.increment());
    return () => {
      dependencies.forEach((dep) => dep());
      this.onDecrement();
    };
  }
}

export const activate = <T extends HasActivator>(model: T): T => {
  $effect(() => {
    return untrack(() => {
      return model.activator.increment();
    });
  });
  return model;
};

export type BaseSubscribableOptions = {
  isPassive?: boolean;
};

export abstract class BaseSubscribable<O extends BaseSubscribableOptions> extends ActivatableModel {
  protected options: O;
  abstract subscribeDependencies: unknown[];
  private cancel?: VoidCallback;

  constructor(options: O) {
    super();
    this.options = options;
  }

  abstract subscribe(): OptionalVoidCallback;

  _subscribe() {
    this.cancel = $effect.root(() => {
      const cancel = _activators.registerSubscribed(this);
      $effect(() => {
        return this.subscribe();
      });
      return () => cancel();
    });
  }

  _unsubscribe() {
    const cancel = this.cancel;
    if (cancel) {
      cancel();
      this.cancel = undefined;
    }
  }

  refresh() {
    this.subscribeDependencies;
    if (this.isActivatedUntracked) {
      this._unsubscribe();
      this._subscribe();
    }
  }

  activate() {
    this._subscribe();
    return () => {
      this._unsubscribe();
    };
  }
}

export interface Loadable {
  isLoading: boolean;
  isLoaded: boolean;
  error: unknown;
}

export abstract class Base<O extends BaseSubscribableOptions> extends BaseSubscribable<O> implements Loadable {
  isLoading = $state(false);
  isLoaded = $state(false);
  error = $state<FirestoreError>();
  isError = $derived.by(() => !!this.error);
  metadata = $state<SnapshotMetadata>();

  onWillSubscribe(subscribe: boolean) {
    this.error = undefined;
    this.metadata = undefined;
    this.isLoading = true;
    if (!subscribe) {
      this.isLoaded = false;
    }
  }

  onError(error: FirestoreError) {
    this.isLoading = false;
    this.error = error;
    this.metadata = undefined;
  }

  onDidLoad(metadata: SnapshotMetadata) {
    this.isLoading = false;
    this.isLoaded = true;
    this.metadata = metadata;
  }
}

export type DocumentOptions = {
  ref: DocumentReference | undefined;
} & BaseSubscribableOptions;

export class Document<T extends DocumentData = DocumentData> extends Base<DocumentOptions> {
  constructor(options: DocumentOptions) {
    super(options);
    this.options = options;
  }

  exists = $state<boolean>();
  data = $state<T>();

  get ref() {
    return this.options.ref;
  }

  get id() {
    return this.ref?.id;
  }

  get path() {
    return this.ref?.path;
  }

  get subscribeDependencies() {
    return [this.ref];
  }

  subscribe() {
    const ref = this.ref;
    this.onWillSubscribe(!!ref);
    if (ref) {
      const opts = { includeMetadataChanges: true };
      return onSnapshot(
        ref,
        opts,
        (snapshot) => this.onSnapshot(snapshot),
        (error) => this.onError(error)
      );
    }
  }

  onSnapshot(snapshot: DocumentSnapshot) {
    this.exists = snapshot.exists();
    if (this.exists) {
      // TODO: diff deep-equal
      this.data = snapshot.data({ serverTimestamps: 'estimate' }) as T;
    }
    this.onDidLoad(snapshot.metadata);
  }

  serialized = $derived.by(() => serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error']));
}

export type BaseQueryOptions = {
  ref: Query | undefined;
} & BaseSubscribableOptions;

export abstract class BaseQuery<O extends BaseQueryOptions> extends Base<O> {
  constructor(options: O) {
    super(options);
  }

  get ref() {
    return this.options.ref;
  }

  get path() {
    const { ref } = this;
    if (ref) {
      const path = (ref as unknown as { path: string | undefined }).path;
      return path;
    }
  }

  get subscribeDependencies() {
    return [this.ref];
  }

  subscribe() {
    const ref = this.ref;
    this.onWillSubscribe(!!ref);
    if (ref) {
      const opts = { includeMetadataChanges: true };
      return onSnapshot(
        ref,
        opts,
        (snapshot) => this.onSnapshot(snapshot),
        (error) => this.onError(error)
      );
    }
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    this.onDidLoad(querySnapshot.metadata);
  }
}

export type QueryAllOptions = BaseQueryOptions;

export class QueryAll<T extends DocumentData> extends BaseQuery<QueryAllOptions> {
  constructor(options: QueryAllOptions) {
    super(options);
  }

  content = $state<Document<T>[]>([]);

  private needsContentReset = false;

  private createDocument(snapshot: QueryDocumentSnapshot) {
    const doc = new Document<T>({ ref: snapshot.ref, isPassive: true });
    doc.onSnapshot(snapshot);
    return doc;
  }

  onWillSubscribe(subscribe: boolean): void {
    super.onWillSubscribe(subscribe);
    if (subscribe) {
      this.needsContentReset = true;
    }
  }

  private maybeResetContent() {
    const content = this.content;
    if (this.needsContentReset) {
      this.content = [];
      this.needsContentReset = false;
    }
    return content;
  }

  protected onSnapshot(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) {
    const previous = this.maybeResetContent();
    const findOrCreate = (snapshot: QueryDocumentSnapshot) => {
      let doc = previous.find((doc) => doc.path === snapshot.ref.path);
      if (!doc) {
        doc = this.createDocument(snapshot);
      }
      return doc;
    };

    const current = this.content;
    querySnapshot.docChanges().forEach(({ type, oldIndex, newIndex, doc: snapshot }) => {
      if (type === 'added') {
        const doc = findOrCreate(snapshot);
        insertObjectAt(current, newIndex, doc);
      } else if (type === 'modified') {
        const doc = current[oldIndex];
        doc.onSnapshot(snapshot);
        if (oldIndex !== newIndex) {
          removeObjectAt(current, oldIndex);
          insertObjectAt(current, newIndex, doc);
        }
      } else if (type === 'removed') {
        removeObjectAt(current, oldIndex);
      }
    });

    super.onSnapshot(querySnapshot);
  }

  serialized = $derived.by(() => serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error']));
}

export type ModelsOptions<I, O> = {
  source: I[];
  model: (doc: I) => O;
};

export class Models<I, O> extends Model {
  private options: ModelsOptions<I, O>;

  constructor(options: ModelsOptions<I, O>) {
    super();
    this.options = options;
  }

  get source() {
    return this.options.source;
  }

  model(source: I) {
    return this.options.model(source);
  }

  createContent() {
    // TODO: diff
    return this.source.map((source) => this.model(source));
  }

  content = $derived.by(() => this.createContent());
}
