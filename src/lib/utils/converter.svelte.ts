export type ConverterOptions<Model> = {
  model: Model;
};

export abstract class Converter<Model, UI, Options extends ConverterOptions<Model> = ConverterOptions<Model>> {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  abstract ui: UI;
  abstract toModel(ui: UI): Model | undefined;
}

export class IntegerConverter extends Converter<number, string> {
  model = $derived(this.options.model);

  ui = $derived.by(() => {
    const model = this.model;
    if (isNaN(model)) {
      return '';
    }
    return model.toString();
  });

  toModel(ui: string) {
    const value = parseInt(ui);
    if (isNaN(value) || value === Infinity) {
      return;
    }
    return value;
  }
}
