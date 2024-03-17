import { insertObjectAt, isTruthy, removeObject, removeObjectAt } from '$lib/utils/array';
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
  setDoc
} from '@firebase/firestore';
import { untrack } from 'svelte';
import { description, serialized } from '$lib/utils/object';
import type { OptionalVoidCallback, VoidCallback } from '$lib/types/types';

export type HasDescriptionAndSerialized = {
  description?: string;
  serialized?: unknown;
};

export class Model<T> implements HasDescriptionAndSerialized {
  options: T;
  declare serialized?: Record<string, unknown>;
  description = $derived.by(() => description(this, this.serialized));

  constructor(options: T) {
    this.options = options;
  }

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
}

export abstract class ActivatableModel<T> extends Model<T> implements HasActivator {
  activator: Activator;
  isActivated = $derived.by(() => this.activator.isActivated);

  get isActivatedUntracked() {
    return untrack(() => this.isActivated);
  }

  constructor(options: T) {
    super(options);
    this.activator = new Activator({
      owner: () => this,
      activate: () => this.activate(),
      dependencies: () => this.dependencies ?? []
    });
  }

  abstract dependencies?: HasActivator[];

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

  constructor(options: ActivatorOptions) {
    this.options = options;
  }

  isActivated = $derived(this.listeners > 0);

  get dependencies() {
    return this.options.dependencies?.() ?? [];
  }

  get owner() {
    return this.options.owner();
  }

  get allDependencies() {
    const deps: HasActivator[] = [this.owner];
    this.dependencies.forEach((dep) => {
      deps.push(dep);
      deps.push(...dep.activator.allDependencies);
    });
    return deps;
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
      // TODO: is this correct?
      setTimeout(() => {
        dependencies.forEach((dep) => dep());
        this.onDecrement();
      }, 0);
    };
  }
}

export const activate = <T extends HasActivator>(model: T): void => {
  $effect(() => {
    return untrack(() => {
      return model.activator.increment();
    });
  });
};

export type BaseSubscribableOptions = {
  isPassive?: boolean;
};

export abstract class BaseSubscribable<O extends BaseSubscribableOptions> extends ActivatableModel<O> {
  abstract subscribeDependencies: unknown[];
  private cancel?: VoidCallback;

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

export const isLoadable: unique symbol = Symbol('loadable');

export interface Loadable {
  [isLoadable]: boolean; // TODO: this is marker to cast to loadable
  isLoading: boolean;
  isLoaded: boolean;
  error: unknown;
}

// Cast from HasActivator to Loadable is messed up
export const allLoadableDependencies = (model: HasActivator) => {
  return model.activator.allDependencies.filter((dep) => {
    const loadable = dep as unknown as Loadable;
    return loadable[isLoadable];
  }) as unknown as Loadable[];
};

export abstract class Base<O extends BaseSubscribableOptions> extends BaseSubscribable<O> implements Loadable {
  [isLoadable] = true;

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

  dependencies = [];
}

type DebounceOptions = {
  delay: number;
  commit: () => Promise<void>;
};

class Debounce {
  options: DebounceOptions;
  private id?: number;

  constructor(options: DebounceOptions) {
    this.options = options;
  }

  cancel() {
    const id = this.id;
    if (id !== undefined) {
      this.id = undefined;
      window.clearTimeout(id);
      return true;
    }
    return false;
  }

  private async commit() {
    await this.options.commit();
  }

  schedule() {
    this.cancel();
    this.id = window.setTimeout(() => this.commit(), this.options.delay);
  }

  force() {
    if (this.cancel()) {
      this.commit();
    }
  }
}

export type DocumentOptions = {
  ref: DocumentReference | undefined;
} & BaseSubscribableOptions;

export class Document<T extends DocumentData = DocumentData> extends Base<DocumentOptions> {
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
      const cancel = onSnapshot(
        ref,
        { includeMetadataChanges: true },
        (snapshot) => this.onSnapshot(snapshot),
        (error) => this.onError(error)
      );
      return () => {
        // TODO: this.debounce.force() needs last ref
        this.debounce.cancel();
        cancel();
      };
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

  async save(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      // TODO: isSaving & error checking
      await setDoc(ref, this.data, { merge: true });
    }
  }

  debounce = new Debounce({
    delay: 300,
    commit: () => this.save()
  });

  scheduleSave() {
    // TODO: do a queue
    this.debounce.schedule();
  }

  serialized = $derived.by(() => serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error']));
}

export type BaseQueryOptions = {
  ref: Query | undefined;
} & BaseSubscribableOptions;

export abstract class BaseQuery<O extends BaseQueryOptions> extends Base<O> {
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
    } else {
      this.content = [];
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

export type ModelsOptions<I extends object, O extends object> = {
  source: I[];
  model: (doc: I) => O | undefined;
} & BaseSubscribableOptions;

export class Models<I extends object, O extends object> extends BaseSubscribable<ModelsOptions<I, O>> {
  private cache: Map<I, O> = new Map();

  private get source() {
    return this.options.source;
  }

  private model(source: I) {
    return this.options.model(source);
  }

  private recreate() {
    const cache = this.cache;
    const next = new Map<I, O>();

    const findOrCreate = (source: I) => {
      let target: O | undefined;
      if (cache.has(source)) {
        target = cache.get(source);
      } else {
        target = this.model(source);
        if (target) {
          next.set(source, target);
        }
      }
      return target;
    };

    const content = this.source.map((source) => findOrCreate(source)).filter(isTruthy);
    this.cache = next;
    return content;
  }

  content = $state<O[]>([]);

  subscribe() {
    return $effect.root(() => {
      $effect(() => {
        this.content = this.recreate();
      });
    });
  }

  subscribeDependencies = [];
  dependencies = [];
}
