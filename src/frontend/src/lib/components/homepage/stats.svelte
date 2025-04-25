<script lang="ts">
    import { onMount } from "svelte";
    import { governanceStore } from "$lib/stores/governance-store";
    import type { DataTotals } from "../../../../../declarations/backend/backend.did";
    import { appStore } from "$lib/stores/app-store";
    import IcfcCoinIcon from "$lib/icons/ICFCCoinIcon.svelte";
    import LocalSpinner from "../shared/local-spinner.svelte";
    import { goto } from "$app/navigation";
    
    interface Stat {
        label: string;
        link: string;
        value: string | number;
    }

    let isLoading = $state(true);
    let dataTotals: DataTotals | undefined = $state(undefined);
    let totalProposalsCount = $state(0);

    onMount(async () => {
        try {
          await loadDataTotals();
          await fetchTotalProposals();
        } catch (error) {
        console.error("Error loading data totals:", error);
        } finally {
        isLoading = false;
        }
    });
  

    async function fetchTotalProposals() {
      
      var proposals = await governanceStore.listProposals();

      if (proposals.proposals.length > 0) {
        const latestProposalId = Number(proposals.proposals[0].id[0]?.id || 0);
        totalProposalsCount = latestProposalId;
      } else if (proposals.proposals.length === 0) {
        totalProposalsCount = 0;
      }
    }

    async function loadDataTotals() {
      try {
        dataTotals = await appStore.getDataTotals();
      } catch (error) {
        console.error("Error loading data totals:", error);
      }
    }

    function navigate(link: string) {
      goto(link, { replaceState: false });
    }


    const stats: Stat[] = $derived([
      { label: "Total Leagues", link: '/data/leagues', value: Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalLeagues).toLocaleString() },
      { label: "Total Clubs", link: '/data/clubs', value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalClubs).toLocaleString() },
      { label: "Total Players", link: '/data/players', value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalPlayers).toLocaleString() },
      { label: "Total Proposals", link: '', value: totalProposalsCount }
    ]);

</script>
{#if isLoading}
      <LocalSpinner />
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-64">
    {#each stats as stat}
      {#if stat.link.length > 0}
      <button onclick={() => navigate(stat.link)} class="bg-BrandGray text-left rounded shadow-md p-4 hover:shadow-lg transition-shadow flex items-center flex-col">
        {#if stat.label == "Total ICFC Rewards"}
          <div class="flex flex-row items-center w-full">
            <IcfcCoinIcon className="w-6 mr-2" />
            <h3 class="text-2xl font-semibold">{stat.value}</h3>
          </div>
        {:else}
          <h3 class="w-full text-2xl font-semibold">{stat.value}</h3>
        {/if}
        <p class="w-full text-sm font-bold text-BrandLightGray">{stat.label}</p>
        </button>

      {:else}
      <div
        class="bg-BrandGray rounded shadow-md p-4 hover:shadow-lg transition-shadow flex items-center flex-col"
      >
        {#if stat.label == "Total ICFC Rewards"}
          <div class="flex flex-row items-center w-full">
            <IcfcCoinIcon className="w-6 mr-2" />
            <h3 class="text-2xl font-semibold">{stat.value}</h3>
          </div>
        {:else}
          <h3 class="w-full text-2xl font-semibold">{stat.value}</h3>
        {/if}
        <p class="w-full text-sm font-bold text-BrandLightGray">{stat.label}</p>
      </div>
      {/if}
    {/each}
  </div>
{/if}