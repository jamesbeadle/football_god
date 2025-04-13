<script lang="ts">
  import { onMount } from "svelte";
  import { ActorFactory } from "../../utils/ActorFactory";
  import { SnsGovernanceCanister, type SnsListProposalsParams } from "@dfinity/sns";
  import { Principal } from "@dfinity/principal";
  import type { ListProposalsResponse, ProposalData, ProposalId } from "@dfinity/sns/dist/candid/sns_governance";
  import ProposalDetail from "$lib/components/governance/voting/proposal-detail.svelte";
  import TabContainer from "$lib/components/shared/tab-container.svelte";
  import LikeButton from "$lib/icons/LikeButton.svelte";
  import DislikeButton from "$lib/icons/DislikeButton.svelte";
  import Checkmark from "$lib/icons/Checkmark.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import { formatUnixDateToSmallReadable } from "$lib/utils/helpers";
  
  let isLoading = true;
  let filterType: string = "all";
  let selectedProposalStatus = [0,1,2,3,4,5];
  let proposals: ListProposalsResponse = { proposals: [], include_ballots_by_caller: [] };
  let filteredProposals: ProposalData[] = [];

  let currentPage: number = 1;
  let totalProposals: number = 100;
  let itemsPerPage: number = 10;
  let totalPages: number = 1;

  let showProposal = false;
  let selectedProposal: ProposalData;

  const PLAYER_FUNCTION_IDS: bigint[] = [52000n, 53000n, 58000n, 60000n];
  const FIXTURE_FUNCTION_IDS: bigint[] = [54000n, 57000n];
  const LEAGUE_FUNCTION_IDS: bigint[] = [55000n, 56000n];
  const CLUB_FUNCTION_IDS: bigint[] = [59000n, 56000n];

  const tabs = [
      { id: 'all', label: 'All' },
      { id: 'player', label: 'Player' },
      { id: 'fixture', label: 'Fixture' },
      { id: 'club', label: 'Club' },
      { id: 'league', label: 'League' },
      { id: 'system', label: 'System' },
  ]

  onMount(() => {
    listProposals();
    isLoading = false;
  });

  async function listProposals(beforeProposal?: ProposalId) {
    const agent: any = await ActorFactory.getGovernanceAgent();
    if (process.env.DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }
    
    const principal: Principal = Principal.fromText(process.env.SNS_GOVERNANCE_CANISTER_ID ?? "");
    
    const { listProposals: governanceListProposals } = SnsGovernanceCanister.create({
      agent,
      canisterId: principal
    });

    const params: SnsListProposalsParams = {
      includeStatus: selectedProposalStatus,
      limit: totalProposals,
      beforeProposal: beforeProposal,
      excludeType: undefined,
      certified: false
    };

    proposals = await governanceListProposals(params);
    filterProposals();
  }

  function filterProposals() {
    if (!proposals || !proposals.proposals) return;

    if (filterType === "all") {
      filteredProposals = proposals.proposals;
    } else {
      filteredProposals = proposals.proposals.filter(proposal => {
        const action = proposal.proposal[0]?.action?.[0];
        let functionId: bigint | undefined;

        if (isExecuteGenericNervousSystemFunction(action)) {
          functionId = action.ExecuteGenericNervousSystemFunction.function_id;
        }

        if (filterType === "player") {
          return functionId !== undefined && PLAYER_FUNCTION_IDS.includes(functionId);
        } else if (filterType === "fixture") {
          return functionId !== undefined && FIXTURE_FUNCTION_IDS.includes(functionId);
        } else if (filterType === "club") {
          return functionId !== undefined && CLUB_FUNCTION_IDS.includes(functionId);
        } else if (filterType === "league") {
          return functionId !== undefined && LEAGUE_FUNCTION_IDS.includes(functionId);
        } else if (filterType === "system") {
          return functionId === undefined || (!PLAYER_FUNCTION_IDS.includes(functionId) && !CLUB_FUNCTION_IDS.includes(functionId) && !FIXTURE_FUNCTION_IDS.includes(functionId)&& !LEAGUE_FUNCTION_IDS.includes(functionId));
        }
        return true;
      });
    }
    totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
    if (currentPage > totalPages) {
      currentPage = 1;
    }
  }

  function isExecuteGenericNervousSystemFunction(action: any): action is { ExecuteGenericNervousSystemFunction: { function_id: bigint } } {
    return action && action.ExecuteGenericNervousSystemFunction !== undefined;
  }

  function paginate(proposals: ProposalData[], page: number): ProposalData[] {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return proposals.slice(start, end);
  }

  function viewProposal(data: ProposalData){
    selectedProposal = data;
    showProposal = true;
  };

  function closeModal() {
    showProposal = false;
  }
  async function setActiveTab(tab: string): Promise<void> {
    isLoading = true;
    filterType = tab;
    currentPage = 1;
    try {
        await listProposals();
    } finally {
        isLoading = false;
    }
  }

  $: filterProposals();

  function getProposalType(proposal: ProposalData): string {
      const action = proposal.proposal[0]?.action?.[0];
      if (isExecuteGenericNervousSystemFunction(action)) {
          const functionId = action.ExecuteGenericNervousSystemFunction.function_id;
          if (PLAYER_FUNCTION_IDS.includes(functionId)) return 'Transfer Player';
          if (FIXTURE_FUNCTION_IDS.includes(functionId)) return 'Fixture';
          if (LEAGUE_FUNCTION_IDS.includes(functionId)) return 'League';
          if (CLUB_FUNCTION_IDS.includes(functionId)) return 'Club';
      }
      return 'System';
  }

  function getAdoptPercentage(proposal: ProposalData): number {
      const yesVotes = Number(proposal.latest_tally[0]?.yes ?? 0n);
      const totalVotes = Number(proposal.latest_tally[0]?.total ?? 0n);
      return totalVotes > 0 ? Number((yesVotes / totalVotes * 100).toFixed(3)) : 0;
  }

  function getRejectPercentage(proposal: ProposalData): number {
    const noVotes = Number(proposal.latest_tally[0]?.no ?? 0n);
    const totalVotes = Number(proposal.latest_tally[0]?.total ?? 0n);
    return totalVotes > 0 ? Number((noVotes / totalVotes * 100).toFixed(3)) : 0;
  }
  
  function formatVotingPower(power: number): string {
      return power.toLocaleString().replace(/,/g, "'");
  }

  function getMyVote(proposal: ProposalData): number | undefined {
      const myBallot = proposal.ballots.find(([voter, _]) => voter === 'YOUR_PRINCIPAL_ID');
      return myBallot?.[1]?.vote;
  }

</script>

<div class="m-4">
  <div class="rounded-md bg-panel">
      <div class="flex justify-center p-4 border-b border-gray-700 md:justify-between">
          <div class="flex flex-row items-center w-full">
              <span class="mr-2 text-gray-400 whitespace-nowrap">Proposal Filters: </span>
              <div class="w-full md:px-3">
                <TabContainer {filterType} {setActiveTab} {tabs} />
              </div>
          </div>
      </div>
      {#if isLoading}
        <LocalSpinner />
        <p class="pb-4 mb-4 text-center">Loading {filterType} Proposals...</p>
      {:else}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="hidden px-6 py-3 text-left md:table-cell">ID</th>
                        <th class="hidden px-6 py-3 text-left md:table-cell">Proposal Type</th>
                        <th class="px-6 py-3 text-center lg:text-left">Proposal Title</th>
                        <th class="hidden px-6 py-3 text-left lg:table-cell">Voting</th>
                    </tr>
                </thead>
                <tbody>
                    {#each paginate(filteredProposals, currentPage) as proposal}
                        <tr 
                            class="h-16 border-b border-gray-700 cursor-pointer hover:bg-BrandGray/50" 
                            on:click={() => viewProposal(proposal)}
                        >
                            <td class="hidden px-6 py-4 md:table-cell">{proposal.id[0]?.id}</td>
                            <td class="hidden px-6 py-4 md:table-cell">{getProposalType(proposal)}</td>
                            <td class="p-4">
                                <div class="mb-1 text-xs text-gray-400 md:hidden">
                                    {getProposalType(proposal)}
                                </div>
                                <div class="line-clamp-2 lg:text-left lg:truncate">
                                    {proposal.proposal[0]?.title}
                                </div>
                            </td>
                            <td class="hidden p-4 lg:table-cell">
                                {#if proposal.executed_timestamp_seconds > 0n || proposal.failed_timestamp_seconds > 0n}
                                    <div class="flex items-center gap-2 pr-2">
                                        <span class={proposal.executed_timestamp_seconds > 0n ? 'text-BrandGreen' : 'text-BrandRed'}>
                                            {proposal.executed_timestamp_seconds > 0n ? 'Adopted' : 'Rejected'}
                                        </span>
                                        <Checkmark 
                                            className="w-4 h-4" 
                                            color={proposal.executed_timestamp_seconds > 0n ? '#2CE3A6' : '#CF5D43'} 
                                        />
                                        <span class="text-gray-400">
                                            {#if proposal.executed_timestamp_seconds > 0n}
                                                {formatUnixDateToSmallReadable((proposal.executed_timestamp_seconds))}
                                            {:else}
                                                {formatUnixDateToSmallReadable((proposal.failed_timestamp_seconds))}
                                            {/if}
                                        </span>
                                    </div>
                                {:else}
                                    <div class="flex items-center gap-2 pr-2">
                                        <div class="flex items-center gap-2">
                                          <span class="text-BrandGreen">Adopt</span>
                                            <div class="rounded-full">
                                                <LikeButton 
                                                    className="w-4 h-4" 
                                                    color={getMyVote(proposal) === 1 ? '#2CE3A6' : '#5A5A5A'}
                                                />
                                            </div>
                                            <div class="flex">
                                                <span class="text-BrandGreen">{getAdoptPercentage(proposal).toFixed(3)}%</span>
                                            </div>
                                        </div>

                                        <div class="w-32 h-2 mx-2 bg-gray-700 rounded-full">
                                            <div 
                                                class="h-full rounded-full {getAdoptPercentage(proposal) > getRejectPercentage(proposal) ? 'bg-BrandGreen ml-0' : 'bg-BrandRed ml-auto'}" 
                                                style="width: {getAdoptPercentage(proposal) > getRejectPercentage(proposal) ? getAdoptPercentage(proposal) : getRejectPercentage(proposal)}%"
                                            ></div>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <span class="text-BrandRed">Reject</span>
                                            <div class="p-1rounded-full">
                                                <DislikeButton 
                                                    className="w-4 h-4"
                                                    color={getMyVote(proposal) === 0 ? '#CF5D43' : '#5A5A5A'}
                                                />
                                            </div>
                                            <div class="stacked-column">
                                                <span class="text-BrandRed">{getRejectPercentage(proposal).toFixed(3)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="flex items-center justify-between p-4 border-t border-gray-700">
            <div class="hidden text-gray-400 md:block">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProposals.length)} of {filteredProposals.length}
            </div>
            <div class="flex justify-center w-full gap-2 md:w-auto md:justify-start">
                <button 
                    class="hidden px-3 py-1 rounded xxs:block bg-BrandGray disabled:opacity-50"
                    disabled={currentPage === 1}
                    on:click={() => currentPage--}
                >
                    Previous
                </button>
                {#each Array(Math.min(5, totalPages)) as _, i}
                    <button 
                        class="px-3 py-1 rounded {currentPage === i + 1 ? 'bg-BrandPurple' : 'bg-BrandGray'}"
                        on:click={() => currentPage = i + 1}
                    >
                        {i + 1}
                    </button>
                {/each}
                <button 
                    class="hidden px-3 py-1 rounded xxs:block bg-BrandGray disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    on:click={() => currentPage++}
                >
                    Next
                </button>
            </div>
        </div>
      {/if}
  </div>
</div>

{#if showProposal}
  <ProposalDetail visible={showProposal} {closeModal} proposal={selectedProposal} onVoteComplete={listProposals} />
{/if}