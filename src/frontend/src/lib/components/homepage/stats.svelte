<script lang="ts">
    import { onMount } from "svelte";
    import { governanceStore } from "$lib/stores/governance-store";
    import type { DataTotals } from "../../../../../declarations/backend/backend.did";
    import { appStore } from "$lib/stores/app-store";
    import IcfcCoinIcon from "$lib/icons/ICFCCoinIcon.svelte";
    import LocalSpinner from "../shared/local-spinner.svelte";
    
    interface Stat {
        label: string;
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

    const stats: Stat[] = $derived([
      { label: "Total Leagues", value: Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalLeagues).toLocaleString() },
      { label: "Total Clubs", value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalClubs).toLocaleString() },
      { label: "Total Players", value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalPlayers).toLocaleString() },
      { label: "Total Neurons", value: "1,234" },
      { label: "Total Proposals", value: totalProposalsCount },
      { label: "Total ICFC Rewards", value: "600,678" },
    ]);

</script>
{#if isLoading}
      <LocalSpinner />
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each stats as stat}
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
    {/each}
  </div>
{/if}