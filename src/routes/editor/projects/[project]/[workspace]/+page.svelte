<script lang="ts">
  import Workspace from '$features/editor/workspace/workspace.svelte';
  import { subscribe } from '$lib/firebase/fire/subscriber.svelte.js';
  import { ProjectModel } from '$lib/models/project/project.svelte.js';
  import { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte.js';
  import { getter } from '$lib/utils/args.js';

  let { data } = $props();
  // let workspace = $derived(data.workspace);
  // $effect(() => subscribe(workspace));

  let workspace = new WorkspaceModel({
    project: new ProjectModel({
      id: getter(() => data.project.id),
    }),
    id: getter(() => data.workspace.id),
  });

  subscribe(workspace);
</script>

<Workspace {workspace} />
