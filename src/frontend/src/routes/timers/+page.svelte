<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { countryStore } from "$lib/stores/country-store";
    import { userStore } from "$lib/stores/user-store";
    import { leagueStore } from "$lib/stores/league-store";
    import type { TimerInfo } from "../../../../declarations/backend/backend.did";
    
    import Layout from "../Layout.svelte";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import AddLeagueModal from "$lib/components/governance/league/create-league.svelte";
    import { formatUnixDateToSmallReadable, formatUnixTimeToTime } from "$lib/utils/helpers";
    import { adminStore } from "$lib/stores/admin-store";
    
    let isLoading = true;
    let timers: TimerInfo[] = [];
  
    onMount(async () => {
      try {
        timers = await adminStore.getTimers();
      } catch (error) {
        console.error("Error fetching timers:", error);
      } finally {
        isLoading = false;
      }
    });
  
  </script>
  
  <Layout>
    {#if isLoading}
      <LocalSpinner />
    {:else}
      <div class="flex justify-between items-center w-full mb-4">
        <p class="text-lg">Football God Timers</p>
      </div>
      
      <div class="space-y-4">
        {#each timers as timer}
          <div
            class="flex flex-row items-center justify-between bg-BrandGray rounded-lg shadow p-4 w-full hover:bg-BrandLightGray transition"
          >
            <p>{timer.id}</p>
            <p>{timer.callbackName}</p>
            <p>{formatUnixDateToSmallReadable(Number(timer.triggerTime))} {formatUnixTimeToTime(Number(timer.triggerTime))}</p>
          
          </div>
        {/each}
      </div>
  
    {/if}
  </Layout>