<script lang="ts">
  import { toasts } from "$lib/stores/toasts-store";
  import { authStore } from "$lib/stores/auth-store";
  import { SnsGovernanceCanister, SnsVote } from "@dfinity/sns";
  import type { ProposalData } from "@dfinity/sns/dist/candid/sns_governance";
  import { createAgent } from "@dfinity/utils";
  import { Principal } from "@dfinity/principal";
  import type { OptionIdentity } from "$lib/types/identity";

  import VotingBar from './voting-bar.svelte';
  import VotingRules from "./voting-rules.svelte";
  import Modal from "../../shared/modal.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let proposal: ProposalData;
  export let onVoteComplete: () => void = () => {};

  const yesVotes = Number(proposal.latest_tally[0]?.yes ?? 0n);
  const noVotes = Number(proposal.latest_tally[0]?.no ?? 0n);
  const totalVotes = Number(proposal.latest_tally[0]?.total ?? 0n);
  const minimumYesExercised = Number(proposal.minimum_yes_proportion_of_exercised[0]?.basis_points ?? 5000n);
  const minimumYesTotal = Number(proposal.minimum_yes_proportion_of_total[0]?.basis_points ?? 300n);

  let isLoading = false;
  let showConfirm = false;
  let vote = "";
  let identity: OptionIdentity
  let showDetails = true;
  
  $: isExecuted = Number(proposal.executed_timestamp_seconds) > 0 || Number(proposal.failed_timestamp_seconds) > 0;

  function voteYes() {
    if (isExecuted) return;
    vote = "Yes";
    showConfirm = true;
  }

  function voteNo() {
    if (isExecuted) return;
    vote = "No";
    showConfirm = true;
  }

  async function confirmVote() {
    isLoading = true;
    try {
      authStore.subscribe((auth) => (identity = auth.identity));
      if (!identity) return;
      const agent = await createAgent({
        identity,
        host: import.meta.env.VITE_AUTH_PROVIDER_URL,
        fetchRootKey: process.env.DFX_NETWORK === "local",
      });

      const { listNeurons, registerVote } = SnsGovernanceCanister.create({
          canisterId: Principal.fromText(
          process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
        ),
        agent,
      });

      const userNeurons = await listNeurons({
        principal: identity.getPrincipal(),
        limit: 10,
        beforeNeuronId: { id: [] },
      });
       userNeurons.forEach((neuron) => {
        const neuronId = neuron.id[0];

        if (!neuronId) {
          toasts.addToast({
            type: "info",
            message: "No neurons found for this principal; cannot vote",
          });
          return;
        }

        switch (vote) {
          case "Yes":
            registerVote({
              proposalId: proposal.id[0]!,
              vote: SnsVote.Yes,
              neuronId: neuronId,
            });
            break;
          case "No":
            registerVote({
              proposalId: proposal.id[0]!,
              vote: SnsVote.No,
              neuronId: neuronId,
            });
            break;
        }
      });
      toasts.addToast({
        message: `Successfully voted ${vote}`,
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      toasts.addToast({
        message: "Error submitting vote",
        type: "error",
      });
    }

    isLoading = false;
    resetForm();
    closeModal();
    onVoteComplete();
  }

  function resetForm() {
    showConfirm = false;
    vote = "";
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal} useFixedPosition={true}>
  {#if isLoading}
    <LocalSpinner />
    <p class="pb-4 mb-4 text-center">Submitting vote...</p>
  {:else}
    <div class="p-6">
      <div class="flex justify-between mb-4">
        <div class="flex-1">
          <h1 class="pr-4 break-words default-header">{proposal.proposal[0]?.title}</h1>
        </div>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
      <div class={`inline-block px-3 py-1 mb-4 rounded-full text-sm font-medium
        ${proposal.executed_timestamp_seconds > 0n 
          ? 'bg-BrandGreen/10 text-BrandGreen' 
          : proposal.failed_timestamp_seconds > 0n 
            ? 'bg-BrandRed/10 text-BrandRed' 
            : 'bg-BrandPurple text-white'}`}
      >
        #{proposal.id[0]?.id} •
        {proposal.executed_timestamp_seconds > 0n 
          ? 'Adopted'
          : proposal.failed_timestamp_seconds > 0n 
            ? 'Rejected' 
            : 'In Voting'}
      </div>
      <div class="space-y-6">
        <div>
          <button 
            class="flex items-center justify-between w-full gap-2 text-xl transition-colors {!showDetails ? 'text-gray-400 hover:text-white' : 'text-white hover:text-gray-400'} "
            on:click|stopPropagation={() => showDetails = !showDetails}
          >
            <span>Details</span>
            {#if showDetails}
              <ArrowUp className="w-6 h-6 {showDetails ? 'fill-white hover:fill-gray-400' : 'fill-gray-400 hover:fill-white'}" />
            {:else}
              <ArrowDown className="w-6 h-6 {showDetails ? 'fill-white hover:fill-gray-400' : 'fill-gray-400 hover:fill-white'}" />
            {/if}
          </button>
          {#if showDetails}
            <div class="mt-3 text-base break-words">{proposal.proposal[0]?.summary}</div>
          {/if}
        </div>

        <h2 class="text-2xl">Voting Results</h2>
            
        <VotingBar 
          {yesVotes} 
          {noVotes} 
          {totalVotes}
          {proposal}
          onVoteYes={voteYes}
          onVoteNo={voteNo}
          {isExecuted}
        />

        <VotingRules 
          {minimumYesExercised} 
          {minimumYesTotal} 
        />

        {#if showConfirm}
          <div class="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div class="p-6 border-2 rounded-lg shadow-lg bg-BrandGray border-BrandPurple/60">
              <p class="mb-4 text-xl text-white">
                Are you sure you want to vote {vote} on proposal {proposal.id[0]?.id}?
              </p>
              <div class="flex justify-center gap-4">
                <button
                  class="px-4 py-2 rounded bg-BrandError hover:bg-BrandError/80"
                  on:click|stopPropagation={resetForm}
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 rounded bg-BrandPurple hover:bg-BrandPurpleDark"
                  on:click={confirmVote}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Modal>