<script lang="ts">
  import { getFlagComponent } from "$lib/utils/helpers";
  export let className;
  
</script>

<svelte:component
  this={getFlagComponent(159)}
  class={className}
/>