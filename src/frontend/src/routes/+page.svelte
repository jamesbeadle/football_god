<script lang="ts">

  import { onMount } from "svelte";
  import { appStore } from "$lib/stores/app-store";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import Stats from "$lib/components/homepage/stats.svelte";
    import Heatmaps from "$lib/components/homepage/heatmaps.svelte";
    import LatestProposals from "$lib/components/homepage/latest-proposals.svelte";

  let isLoading = $state(true);

  onMount(async () => {
    try {
      await appStore.checkServerVersion();
    } catch (error) {
      console.error("Error checking app version:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <FullScreenSpinner />
{:else}
  <div class="stacked-column">
    <Stats />
    <Heatmaps />
    <LatestProposals />
  </div>
{/if}