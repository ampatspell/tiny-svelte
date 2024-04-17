export class Thing {
  data = $state<{ name: { content: string } }>();

  subscribe() {
    setTimeout(() => {
      this.data = {
        name: {
          content: `Zeeba Neighba`,
        },
      };
      this.name;
    }, 0);
  }

  name = $derived(this.data?.name.content);
}

export class Things {
  content = $state<Thing[]>([]);

  subscribe() {
    setTimeout(() => {
      const thing = new Thing();
      thing.subscribe();

      // This breaks thing.name derived
      thing.name;

      this.content.push(thing);
      this.content.map((t) => t.name);
    }, 0);
  }

  names = $derived(this.content.map((thing) => thing.name));
}
