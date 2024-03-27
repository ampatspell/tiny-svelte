export type ThingData = {
  name: string;
  position: {
    x: number;
    y: number;
  };
};

export class Thing {
  data = $state<ThingData>();
  index = 0;

  next() {
    const index = this.index++;
    this.data = {
      name: `Name #${index}`,
      position: {
        x: index * 5,
        y: index * 5,
      },
    };
  }

  subscribe() {
    setTimeout(() => {
      this.next();
    }, 0);
  }

  position = $derived(this.data?.position);
}

export class Things {
  content = $state<Thing[]>([]);

  subscribe() {
    setTimeout(() => {
      const thing = new Thing();
      this.content.push(thing);
      thing.subscribe();
      this.content.map((e) => e.position);
    }, 0);
  }
}
