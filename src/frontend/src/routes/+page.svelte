<script lang="ts">
  import { onMount } from "svelte";
  import { appStore } from "$lib/stores/app-store";

  import Layout from "./+layout.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import type { ListProposalsResponse, ProposalData, ProposalId } from "@dfinity/sns/dist/candid/sns_governance";
    import { ActorFactory } from "$lib/utils/ActorFactory";
    import { Principal } from "@dfinity/principal";
    import { SnsGovernanceCanister, type SnsListProposalsParams } from "@dfinity/sns";
  
  interface Stat {
    label: string;
    value: string | number;
  }

  interface HeatmapData {
    id: string;
    data: number[][];
  }

  let proposals: ListProposalsResponse = $state({ proposals: [], include_ballots_by_caller: [] });
  let totalProposalsCount = $state(0); 
  
  let currentPage = $state(1);
  const itemsPerPage = 3;
  const totalPages = $derived(Math.ceil(totalProposalsCount / itemsPerPage));

  let currentHeatmapIndex = $state(0);
  let heatmaps: HeatmapData[] = $state([
    { id: 'Most Valuable Players', data: generateHeatmapData() },
    { id: 'Most Valuable Clubs', data: generateHeatmapData() },
  ]);
  let selectedProposalStatus = [0,1,2,3,4,5];
  let totalProposals: number = 3;
 
  let isLoading = $state(true);

  onMount(async () => {
    try {
      await appStore.checkServerVersion();
      await fetchTotalProposalsCount();
      await listProposals();
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      isLoading = false;
    }
  });

  async function fetchTotalProposalsCount() {
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
      limit: 1,
      beforeProposal: undefined,
      excludeType: undefined,
      certified: false,
    };

    const response = await governanceListProposals(params);
    proposals = response;
    totalProposals = response.proposals.length > 0 ? 1000 : 0;
  }

  async function listProposals() {
    isLoading = true;
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
          const tempParams = { ...params, limit: Math.min(offset, itemsPerPage), beforeProposal: lastProposalId };
          const tempProposals = await governanceListProposals(tempParams);
          if (tempProposals.proposals.length === 0) break;
          lastProposalId = tempProposals.proposals[tempProposals.proposals.length - 1].id[0];
          offset -= tempProposals.proposals.length;
        }
        params.beforeProposal = lastProposalId;
      }

      proposals = await governanceListProposals(params);
    } finally {
      isLoading = false;
    }
  }



  function generateHeatmapData(): number[][] {
    return Array(7)
      .fill(0)
      .map(() =>
        Array(7)
          .fill(0)
          .map(() => Math.random()),
      );
  }

  function cycleHeatmap() {
    currentHeatmapIndex = (currentHeatmapIndex + 1) % heatmaps.length;
  }

  const stats: Stat[] = $state([
    { label: 'Total Leagues', value: '27' },
    { label: 'Total Clubs', value: '442' },
    { label: 'Total Players', value: '13,330' },
    { label: 'Total Neurons', value: '1,234' },
    { label: 'Total Proposals', value: '1,234' },
    { label: 'Total ICFC Rewards', value: '600,678' }
  ]);
  
  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

</script>


<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <div class="flex flex-col">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {#each stats as stat}
          <div
            class="bg-BrandLightGray rounded shadow-md p-4 hover:shadow-lg transition-shadow flex items-center flex-col"
          >
            <h3 class="w-full text-2xl font-semibold">{stat.value}</h3>
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
          <div class="grid grid-cols-7 gap-1">
            {#each heatmaps[currentHeatmapIndex].data as row}
              {#each row as value}
                <div
                  class="w-full h-8 rounded"
                  style="background-color: rgba(127, 86, 250, {value});"
                  title="Value: {value.toFixed(2)}"
                ></div>
              {/each}
            {/each}
          </div>
        </div>

        <div class="md:col-span-1 bg-BrandLightGray rounded shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Proposals</h2>
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
            <span class="text-sm">Page {currentPage} of {totalPages || 1}</span>
            <button
              onclick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</Layout>