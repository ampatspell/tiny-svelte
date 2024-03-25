export type ThingData = {
  name: string;
  position: {
    x: number;
    y: number
  };
}

export class Thing {
  data = $state<ThingData>();
  index = 0;

  next() {
    const index = this.index++;
    this.data = {
      name: `Name #${index}`,
      position: {
        x: index * 5,
        y: index * 5
      }
    };
  }

  subscribe() {
    const id = setInterval(() => {
      this.next();
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }

  position = $derived(this.data?.position);

}

export class Things {
  content = $state<Thing[]>([]);

  subscribe() {
    const content: (() => void)[] = [];

    const id = setInterval(() => {
      const thing = new Thing();
      this.content.push(thing);
      content.push(thing.subscribe());

      this.content.map(e => e.position);
    }, 1000);

    return () => {
      content.forEach(cancel => cancel());
      clearInterval(id);
    };
  }
}
