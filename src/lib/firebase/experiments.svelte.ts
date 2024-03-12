import { collection, orderBy, query } from '@firebase/firestore';
import { ActivatableModel, QueryAll } from './firestore.svelte';
import { firebase } from './firebase.svelte';
import { getter, options } from '$lib/utils/args';

export type ProjectDocumentData = {
  identifier: string;
};

export class Projects extends ActivatableModel {
  order = $state<'asc' | 'desc'>('asc');

  toggleOrder() {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
  }

  get ref() {
    return query(collection(firebase.firestore, 'projects'), orderBy('identifier', this.order));
  }

  query = new QueryAll<ProjectDocumentData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  dependencies = [this.query];

  activate() {
    console.log('projects activate');
    return () => {
      console.log('projects deactivate');
    };
  }
}
