import { PUBLIC_FIREBASE } from '$env/static/public';
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { DocumentReference, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { initializeAuth, type Auth, browserLocalPersistence } from 'firebase/auth';
import { setGlobal } from '$lib/utils/set-global';
import { Session } from './session.svelte';
import { removeObject } from '$lib/utils/array';
import type { FirestoreModel } from './firestore.svelte';

const options = JSON.parse(PUBLIC_FIREBASE) as FirebaseOptions;

export class Firebase {
  options: FirebaseOptions;
  private _firestore?: Firestore;
  private _auth?: Auth;

  session: Session;
  subscribed: Subscribed;

  constructor(options: FirebaseOptions) {
    this.options = options;
    this.session = new Session(this);
    this.subscribed = new Subscribed();
  }

  get app() {
    let [app] = getApps();
    if (!app) {
      app = initializeApp(this.options);
    }
    return app;
  }

  get firestore() {
    if (!this._firestore) {
      this._firestore = initializeFirestore(this.app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    }
    return this._firestore;
  }

  get auth() {
    if (!this._auth) {
      this._auth = initializeAuth(this.app, { persistence: browserLocalPersistence });
    }
    return this._auth;
  }

  get dashboardUrl() {
    return `https://console.firebase.google.com/u/0/project/${this.options.projectId}`;
  }

  openDashboard() {
    window.open(this.dashboardUrl);
  }

  openDocumentReference(ref: DocumentReference) {
    const path = encodeURIComponent(ref.path);
    window.open(`${this.dashboardUrl}/firestore/data/${path}`);
  }

  serialized = $derived.by(() => {
    const {
      options: { projectId },
      session
    } = this;
    return {
      projectId,
      session: session.serialized
    };
  });
}

export class Subscribed {
  all = $state<FirestoreModel[]>([]);

  register(entry: FirestoreModel) {
    this.all.push(entry);
    return () => {
      removeObject(this.all, entry);
    };
  }
}

export const firebase = new Firebase(options);

setGlobal({ firebase });
