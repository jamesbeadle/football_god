<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import type { FootballLeagueDTO } from "../../../declarations/backend/backend.did";
  import { leagueStore } from "$lib/stores/league-store";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";

  let isLoading = true;
  let leagues: FootballLeagueDTO[] = [];

  onMount(async () => {
    try {
      leagues = await leagueStore.getLeagues();
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <p class="text-lg mb-4">Home</p>
    <div class="flex flex-col w-full space-y-2">
      {#each leagues as league}
        <div class="flex items-center justify-between bg-BrandLightGray px-4 py-2 rounded shadow">
          <p class="text-sm font-medium">{league.name}</p>
          <ArrowDown className="w-5 h-5 text-gray-600" />
        </div>
      {/each}
    </div>
  {/if}
</Layout>
