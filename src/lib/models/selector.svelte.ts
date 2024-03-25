import { Model } from '$lib/firebase/fire/model.svelte';
import { serialized } from '$lib/utils/object';

export type HasExists = {
  exists: boolean | undefined;
};

export type ExistingSelectorOptions<I, M extends HasExists> = {
  models: M[];
  value: I | undefined;
  select: (model: M, value: I) => boolean;
};

export class ExistingSelector<I, M extends HasExists> extends Model<ExistingSelectorOptions<I, M>> {
  value = $derived(this.options.value);
  models = $derived(this.options.models);
  select = $derived(this.options.select);

  selected = $derived.by(() => {
    const value = this.value;
    if (value) {
      const select = this.select;
      return this.models.find((model) => select(model, value));
    }
  });

  model = $derived.by(() => {
    const selected = this.selected;
    if (selected?.exists) {
      return selected;
    }
  });

  serialized = $derived(serialized(this, ['value', 'model']));
}
