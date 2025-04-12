<script lang="ts">
  import { onMount } from "svelte";
  import { appStore } from "$lib/stores/app-store";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import type { ListProposalsResponse, ProposalId } from "@dfinity/sns/dist/candid/sns_governance";
  import { ActorFactory } from "$lib/utils/ActorFactory";
  import { Principal } from "@dfinity/principal";
  import { SnsGovernanceCanister, type SnsListProposalsParams } from "@dfinity/sns";
  import IcfcCoinIcon from "$lib/icons/ICFCCoinIcon.svelte";
  import { playerStore } from "$lib/stores/player-store";
  import { clubStore } from "$lib/stores/club-store";
  import type { ClubValueLeaderboard, DataTotals, PlayerValueLeaderboard } from "../../../declarations/backend/backend.did";

  interface Stat {
    label: string;
    value: string | number;
  }

  interface HeatmapData {
    id: string;
    data: { value: number; color?: string; label: string }[][];
  }

  let proposals: ListProposalsResponse = $state({ proposals: [], include_ballots_by_caller: [] });
  let totalProposalsCount = $state(0);
  let currentPage = $state(1);
  const itemsPerPage = 3;
  const totalPages = $derived(Math.ceil(totalProposalsCount / itemsPerPage) || 1);

  let currentHeatmapIndex = $state(0);
  let heatmaps: HeatmapData[] = $state([]);
  let selectedProposalStatus = [0, 1, 2, 3, 4, 5];
  let isLoading = $state(true);
  let isFetchingProposals = $state(false);

  let clubValueLeaderboard: ClubValueLeaderboard | undefined = $state(undefined);
  let playerValueLeaderboard: PlayerValueLeaderboard | undefined = $state(undefined);
  let dataTotals: DataTotals | undefined = $state(undefined);

  onMount(async () => {
    try {
      await appStore.checkServerVersion();
      await loadPlayerValueLeaderboard();
      await loadClubValueLeaderboard();
      await loadDataTotals();
      await fetchProposals();
      updateHeatmaps();
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      isLoading = false;
    }
  });

  async function loadPlayerValueLeaderboard() {
    try {
      playerValueLeaderboard = await playerStore.getPlayerValueLeaderboard();
    } catch (error) {
      console.error("Error loading player leaderboard:", error);
    }
  }

  async function loadClubValueLeaderboard() {
    try {
      clubValueLeaderboard = await clubStore.getClubValueLeaderboard();
    } catch (error) {
      console.error("Error loading club leaderboard:", error);
    }
  }

  async function loadDataTotals() {
    try {
      dataTotals = await appStore.getDataTotals();
    } catch (error) {
      console.error("Error loading data totals:", error);
    }
  }

  function updateHeatmaps() {
    const clubData = generateClubHeatmapData();
    const playerData = generatePlayerHeatmapData();
    heatmaps = [
      { id: "Most Valuable Clubs", data: clubData },
      { id: "Most Valuable Players", data: playerData },
    ];
  }

  function generateClubHeatmapData(): { value: number; color?: string; label: string }[][] {
    if (!clubValueLeaderboard?.clubs?.length) {
      return Array(5)
        .fill(0)
        .map(() => Array(5).fill({ value: 0, label: "" }));
    }

    const clubs = clubValueLeaderboard.clubs.slice(0, 25); 
    const maxValue = Math.max(...clubs.map((club) => club.totalValue));
    const grid = Array(5)
      .fill(0)
      .map(() => Array(5).fill({ value: 0, label: "" }));

    let index = 0;
    for (let i = 0; i < 5 && index < clubs.length; i++) {
      for (let j = 0; j < 5 && index < clubs.length; j++) {
        const club = clubs[index];
        grid[i][j] = {
          value: club.totalValue / maxValue, 
          color: club.primaryColour,
          label: club.clubName,
        };
        index++;
      }
    }
    return grid;
  }

  function generatePlayerHeatmapData(): { value: number; color?: string; label: string }[][] {
    if (!playerValueLeaderboard?.players?.length) {
      return Array(5)
        .fill(0)
        .map(() => Array(5).fill({ value: 0, label: "" }));
    }

    const players = playerValueLeaderboard.players.slice(0, 25); 
    const maxValue = Math.max(...players.map((player) => player.totalValue));
    const grid = Array(5)
      .fill(0)
      .map(() => Array(5).fill({ value: 0, label: "" }));

    let index = 0;
    for (let i = 0; i < 5 && index < players.length; i++) {
      for (let j = 0; j < 5 && index < players.length; j++) {
        const player = players[index];
        const normalizedValue = player.totalValue / maxValue;
        grid[i][j] = {
          value: normalizedValue, 
          color: `rgba(127, 86, 250, ${normalizedValue})`, 
          label: `Player ${player.playerId}`,
        };
        index++;
      }
    }
    return grid;
  }


  async function fetchProposals() {
    isFetchingProposals = true;
    try {
      const agent: any = await ActorFactory.getGovernanceAgent();
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }

      const principal: Principal = Principal.fromText(process.env.SNS_GOVERNANCE_CANISTER_ID ?? "");
      const { listProposals: governanceListProposals } = SnsGovernanceCanister.create({
        agent,
        canisterId: principal,
      });

      const params: SnsListProposalsParams = {
        includeStatus: selectedProposalStatus,
        limit: itemsPerPage,
        beforeProposal: undefined,
        excludeType: undefined,
        certified: false,
      };

      if (currentPage > 1) {
        let offset = (currentPage - 1) * itemsPerPage;
        let lastProposalId: ProposalId | undefined;

        while (offset > 0) {
          const tempParams = { ...params, limit: Math.min(offset, 100), beforeProposal: lastProposalId };
          const tempProposals = await governanceListProposals(tempParams);
          if (tempProposals.proposals.length === 0) break;
          lastProposalId = tempProposals.proposals[tempProposals.proposals.length - 1].id[0];
          offset -= tempProposals.proposals.length;
        }
        params.beforeProposal = lastProposalId;
      }

      proposals = await governanceListProposals(params);

      if (currentPage === 1 && proposals.proposals.length > 0) {
        const latestProposalId = Number(proposals.proposals[0].id[0]?.id || 0);
        totalProposalsCount = latestProposalId;
      } else if (proposals.proposals.length === 0) {
        totalProposalsCount = 0;
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      isFetchingProposals = false;
    }
  }

  function cycleHeatmap() {
    currentHeatmapIndex = (currentHeatmapIndex + 1) % heatmaps.length;
  }

  const stats: Stat[] = $derived([
    { label: "Total Leagues", value: Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalLeagues).toLocaleString() },
    { label: "Total Clubs", value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalClubs).toLocaleString() },
    { label: "Total Players", value:  Number(dataTotals == undefined ? (0).toLocaleString() : (dataTotals as DataTotals).totalPlayers).toLocaleString() },
    { label: "Total Neurons", value: "1,234" },
    { label: "Total Proposals", value: totalProposalsCount },
    { label: "Total ICFC Rewards", value: "600,678" },
  ]);

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProposals();
    }
  }
</script>

{#if isLoading}
  <FullScreenSpinner />
{:else}
  <div class="flex flex-col">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {#each stats as stat}
        <div
          class="bg-BrandLightGray rounded shadow-md p-4 hover:shadow-lg transition-shadow flex items-center flex-col"
        >
          {#if stat.label == "Total ICFC Rewards"}
            <div class="flex flex-row items-center w-full">
              <IcfcCoinIcon className="w-6 mr-2" />
              <h3 class="text-2xl font-semibold">{stat.value}</h3>
            </div>
          {:else}
            <h3 class="w-full text-2xl font-semibold">{stat.value}</h3>
          {/if}
          <p class="w-full text-sm font-bold text-BrandDisabled">{stat.label}</p>
        </div>
      {/each}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-BrandLightGray rounded shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{heatmaps[currentHeatmapIndex].id}</h2>
          <button
            onclick={cycleHeatmap}
            class="bg-BrandPurpleDark text-white px-4 py-2 rounded hover:bg-BrandPurple transition-colors"
          >
            Next
          </button>
        </div>
        <div class="grid grid-cols-5 gap-1">
          {#each heatmaps[currentHeatmapIndex].data as row}
            {#each row as cell}
              <div
                class="w-full h-16 rounded flex items-center justify-center text-xs"
                style="background-color: {cell.color || '#7F56FA'}; transform: scale({Math.max(0.5, cell.value)});"
                title="{cell.label}: {cell.value.toFixed(2)}"
              >
                {cell.label}
              </div>
            {/each}
          {/each}
        </div>
      </div>

      <div class="md:col-span-1 bg-BrandLightGray rounded shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Proposals</h2>
        {#if isFetchingProposals}
          <LocalSpinner />
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b dark:border-gray-700">
                  <th class="py-2 px-3 text-sm font-medium">ID</th>
                  <th class="py-2 px-3 text-sm font-medium">Title</th>
                  <th class="py-2 px-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {#if proposals.proposals.length === 0}
                  <tr>
                    <td colspan="3" class="py-2 px-3 text-sm text-center">No proposals found</td>
                  </tr>
                {:else}
                  {#each proposals.proposals as proposal}
                    <tr
                      class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td class="py-2 px-3 text-sm">{proposal.id[0]?.id.toString() ?? "N/A"}</td>
                      <td class="py-2 px-3 text-sm">{proposal.proposal[0]?.title ?? "Untitled"}</td>
                      <td class="py-2 px-3 text-sm">
                        <span
                          class="{proposal.executed_timestamp_seconds > 0n
                            ? 'text-green-600 dark:text-green-400'
                            : proposal.failed_timestamp_seconds > 0n
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'}"
                        >
                          {proposal.executed_timestamp_seconds > 0n
                            ? "Executed"
                            : proposal.failed_timestamp_seconds > 0n
                            ? "Failed"
                            : "Active"}
                        </span>
                      </td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center mt-4">
            <button
              onclick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Prev
            </button>
            <span class="text-sm">Page {currentPage} of {totalPages}</span>
            <button
              onclick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages || totalProposalsCount === 0}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}