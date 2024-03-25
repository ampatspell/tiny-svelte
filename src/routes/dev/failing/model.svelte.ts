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

  constructor() {
  }

  get _next() {
    const index = this.index++;
    return {
      name: `Name #${index}`,
      position: {
        x: index * 5,
        y: index * 5
      }
    };
  }

  subscribe() {
    return $effect.root(() => {
      $effect.pre(() => {
        const id = setInterval(() => {
          this.data = this._next;
          console.log(this.data);
        }, 1000);
        return () => {
          clearInterval(id);
        }
      });
    });
  }

  position = $derived(this.data?.position);

}
