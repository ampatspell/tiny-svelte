<script lang="ts" context="module">
  export class Thing {
    data = $state<{ name: string }>();

    subscribe() {
      setTimeout(() => {
        this.data = {
          name: `Zeeba Neighba`,
        };
      }, 0);
    }

    name = $derived(this.data?.name);
  }

  export class Things {
    thing = $state<Thing>();

    subscribe() {
      setTimeout(() => {
        this.thing = new Thing();
        this.thing.subscribe();

        // This breaks thing.name derived
        this.thing.name;
      }, 0);
    }
  }
</script>

<script lang="ts">
  let model = new Things();
  $effect(() => model.subscribe());
</script>

<div>name = {model.thing?.name}</div>
