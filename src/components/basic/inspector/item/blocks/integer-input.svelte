<script lang="ts">
  import Input from '$components/basic/input/input.svelte';
  import { getter, options } from '$lib/utils/args';
  import { IntegerConverter } from '$lib/utils/converter.svelte';

  let {
    value,
    onChange
  }: {
    value: number;
    onChange: (value: number) => void;
  } = $props();

  let converter = new IntegerConverter(
    options({
      model: getter(() => value)
    })
  );

  let onBlur = () => false;

  let onEnter = (value: string) => {
    let model = converter.toModel(value);
    if (model === undefined) {
      return false;
    } else {
      onChange(model);
    }
  };
</script>

<Input value={converter.ui} {onBlur} {onEnter} />
