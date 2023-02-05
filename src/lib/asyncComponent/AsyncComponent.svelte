<script lang="ts">
  type AsyncModule = $$Generic<Promise>;

  let asyncComponent: () => AsyncModule;
  let loading = false;
  export { asyncComponent as component };

  let component: AsyncModule;

  async function fetchOrGet() {
    if (!component) {
      loading = true;
      component = await asyncComponent().finally(() => {
        loading = false;
      });
    }
    return component;
  }
</script>

<slot loading="{loading}" fetchOrGet="{fetchOrGet}" />
