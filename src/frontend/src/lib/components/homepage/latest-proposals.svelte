<script lang="ts">
    import { onMount } from "svelte";
    import { Principal } from "@dfinity/principal";
    import type { ListProposalsResponse, ProposalId } from "@dfinity/sns/dist/candid/sns_governance";
    import { SnsGovernanceCanister, type SnsListProposalsParams } from "@dfinity/sns";
    import { ActorFactory } from "$lib/utils/ActorFactory";
    import LocalSpinner from "../shared/local-spinner.svelte";
  
    let isLoading = $state(true);
    let currentPage = $state(1);
    let totalProposalsCount = $state(0);
    const itemsPerPage = 3;
    const totalPages = $derived(Math.ceil(totalProposalsCount / itemsPerPage) || 1);
    let selectedProposalStatus = [0, 1, 2, 3, 4, 5];
    let proposals: ListProposalsResponse = $state({ proposals: [], include_ballots_by_caller: [] });
  
  onMount(async () => {
    try {
      await fetchProposals();
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      isLoading = false;
    }
  });


  async function fetchProposals() {
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
  }

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProposals();
    }
  }
</script>
<div class="md:col-span-1 bg-BrandLightGray rounded shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Recent Proposals</h2>
    {#if isLoading}
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