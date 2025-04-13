<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import type { ListProposalsResponse } from "@dfinity/sns/dist/candid/sns_governance";
  import LocalSpinner from "../shared/local-spinner.svelte";

  let isLoading = $state(true);
  let currentPage = $state(1);
  let totalProposalsCount = $state(0);
  const itemsPerPage = 4;
  const totalPages = $derived(Math.ceil(totalProposalsCount / itemsPerPage) || 1);
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
    isLoading = true;
    try {
      if (currentPage === 1) {
        proposals = await governanceStore.listProposals(undefined, [0, 1, 2, 3, 4, 5], itemsPerPage);
        if (proposals.proposals.length > 0) {
          const latestProposalId = Number(proposals.proposals[0].id[0]?.id || 0);
          totalProposalsCount = latestProposalId;
        } else {
          totalProposalsCount = 0;
        }
      } else {
        const beforeProposalId = totalProposalsCount - (currentPage - 1) * itemsPerPage;
        proposals = await governanceStore.listProposals(
          { id: BigInt(beforeProposalId) },
          [0, 1, 2, 3, 4, 5],
          itemsPerPage
        );
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      isLoading = false;
    }
  }

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProposals();
    }
  }
</script>

<div class="w-full bg-BrandGray rounded shadow-md p-6">
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