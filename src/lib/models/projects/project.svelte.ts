import { Document, Model } from '$lib/firebase/firestore.svelte';
import type { ProjectData } from '$lib/types/project';
import { serialized } from '$lib/utils/object';
import type { ProjectsModel } from './projects.svelte';

export type ProjectModelOptions = {
  projects: ProjectsModel;
  doc: Document<ProjectData>;
};

export class ProjectModel extends Model<ProjectModelOptions> {
  doc = $derived(this.options.doc);
  id = $derived(this.doc.id);
  identifier = $derived(this.doc.data!.identifier);
  serialized = $derived(serialized(this, ['id', 'identifier']));
}
