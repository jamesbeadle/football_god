<script lang="ts">
    import { onMount } from "svelte";
    import { ActorFactory } from "../../utils/ActorFactory";
    import { SnsGovernanceCanister, type SnsListProposalsParams } from "@dfinity/sns";
    import { Principal } from "@dfinity/principal";
    import type { ListProposalsResponse, ProposalData, ProposalId } from "@dfinity/sns/dist/candid/sns_governance";
      import ProposalDetail from "$lib/components/governance/proposal-detail.svelte";
    
    let filterType: string = "all";
    let selectedProposalStatus = [0,1,2,3,4,5];
    let proposals: ListProposalsResponse = { proposals: [], include_ballots_by_caller: [] };
    let filteredProposals: ProposalData[] = [];
  
    let currentPage: number = 1;
    let itemsPerPage: number = 100;
    let totalPages: number = 1;
  
    let showProposal = false;
    let selectedProposal: ProposalData;
  
    const PLAYER_FUNCTION_IDS: bigint[] = [52000n, 53000n, 58000n, 60000n];
    const FIXTURE_FUNCTION_IDS: bigint[] = [54000n, 57000n];
    const LEAGUE_FUNCTION_IDS: bigint[] = [55000n, 56000n];
    const CLUB_FUNCTION_IDS: bigint[] = [59000n, 56000n];
  
    onMount(() => {
      listProposals();
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
        limit: itemsPerPage,
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
      currentPage = 1;
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
  
    $: filterProposals();
</script>
  
{#if showProposal}
    <ProposalDetail visible={showProposal} {closeModal} proposal={selectedProposal} />
{/if}
  
<div class="m-4">
    <div class="bg-panel rounded-md">
        <div class="flex justify-between items-center my-4">
            <div class="flex items-center space-x-4">
            <label class="flex items-center">
                <input type="radio" name="filter" value="all" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">All</span>
            </label>
            <label class="flex items-center">
                <input type="radio" name="filter" value="player" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">Player</span>
            </label>
            <label class="flex items-center">
                <input type="radio" name="filter" value="fixture" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">Fixture</span>
            </label>
            <label class="flex items-center">
                <input type="radio" name="filter" value="club" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">Club</span>
            </label>
            <label class="flex items-center">
                <input type="radio" name="filter" value="league" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">League</span>
            </label>
            <label class="flex items-center">
                <input type="radio" name="filter" value="system" bind:group={filterType} class="form-radio" on:change={() => listProposals()} />
                <span class="ml-2">System</span>
            </label>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 mt-2 sm:grid-cols-2 lg:grid-cols-3 mx-4 mb-4 p-4">
            {#if filteredProposals.length > 0}
            {#each paginate(filteredProposals, currentPage) as proposal}
                <div class="border border-gray-700 rounded-lg p-4 bg-light-gray flex flex-col">
                <div class="font-bold truncate">Proposal {proposal.id[0]?.id}</div>
                <div class="truncate my-2 text-lg">{proposal.proposal[0]?.title}</div>
                <div class="truncate text-sm">Summary: {proposal.proposal[0]?.summary}</div>
                <button on:click={() => viewProposal(proposal)} class="p-2 fpl-button rounded-md mt-4">View</button>
                </div>
            {/each}
            {/if}
        </div>
    </div>
</div>