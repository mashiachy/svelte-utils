<script lang="ts">
  import { set, remove } from "$lib/query";
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import type {
    ArrayableString,
    RoutedDialogKey,
    RoutedDialogValue,
  } from "./types";

  function forEach(
    value: ArrayableString,
    method: "some" | "map",
    cb: (...args: any) => any
  ) {
    if (Array.isArray(value)) return value[method](cb);
    else return cb(value);
  }

  export let key: RoutedDialogKey;
  export let value: RoutedDialogValue;

  $: value = forEach(key, "map", (key) => $page.url.searchParams.get(key));

  // trash. everything should work without this line,
  // but swap dialog doesn't work without this. todo: refactor & fix.
  $: if (key && value) set(key, value);

  export async function show(newValue?: string | string[]) {
    if (newValue && forEach(newValue, "some", Boolean)) {
      set(key, newValue);
    } else if (forEach(value, "some", Boolean)) {
      set(key, value);
    }
  }

  export async function hide() {
    await remove(key);
  }

  $: visible = forEach(value, "some", Boolean);

  onDestroy(() => {
    if (visible) hide();
  });
</script>

<slot
  show="{show}"
  hide="{hide}"
  visible="{visible}"
  key="{key}"
  value="{value}"
/>
