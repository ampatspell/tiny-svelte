<script lang="ts">
  import Button from '$lib/editor/button.svelte';
  import { Assets, Project, Weird } from '$lib/firebase/experiments.svelte';
  import Json from '$lib/json.svelte';
  import { getter, options } from '$lib/utils/args';
  import { setGlobal } from '$lib/utils/set-global';

  let weirdId = $state<string | undefined>('hello');

  let selectWeird = (id?: string) => {
    weirdId = id;
  };

  let weird = new Weird(
    options({
      id: getter(() => weirdId)
    })
  );

  //

  let projectId = $state('hello');

  let project = new Project(
    options({
      id: getter(() => projectId)
    })
  );

  let assets = new Assets(
    options({
      project
    })
  );

  let selectProject = (id: string) => {
    projectId = id;
  };

  setGlobal({ project });
</script>

<div class="page">
  <div class="column">
    <div class="row">
      {#each ['hello', undefined] as id}
        <Button value={id} onClick={() => selectWeird(id)} />
      {/each}
    </div>

    <div class="row">
      <Json value={weird.doc.serialized} />
    </div>

    <div class="row">
      <Json value={weird.query.serialized} />
    </div>

    <div class="row">
      {#each ['hello', 'another'] as id}
        <Button value={id} onClick={() => selectProject(id)} />
      {/each}
    </div>

    <div class="row">
      project: {project.ref.path}
    </div>

    <div class="row">
      <Json value={project.doc.serialized} />
    </div>

    <div class="row">
      assets: {assets.ref.path}
    </div>

    <div class="row">
      <Json value={assets.query.serialized} />
    </div>
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    > .column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      > .row {
        display: flex;
        flex-direction: row;
        gap: 10px;
      }
    }
  }
</style>
