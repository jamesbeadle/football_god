<script lang="ts">
  import { toasts } from "$lib/stores/toasts-store";
  import { authStore } from "$lib/stores/auth-store";
  import { ActorFactory } from "../../utils/ActorFactory";
  import { SnsGovernanceCanister, SnsVote } from "@dfinity/sns";
  import type { ProposalData } from "@dfinity/sns/dist/candid/sns_governance";

  import VotingBar from './voting-bar.svelte';
  import VotingRules from "./voting-rules.svelte";
  import Modal from "../shared/modal.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let proposal: ProposalData;

  const yesVotes = Number(proposal.latest_tally[0]?.yes ?? 0n);
  const noVotes = Number(proposal.latest_tally[0]?.no ?? 0n);
  const totalVotes = Number(proposal.latest_tally[0]?.total ?? 0n);
  const minimumYesExercised = Number(proposal.minimum_yes_proportion_of_exercised[0]?.basis_points ?? 5000n);
  const minimumYesTotal = Number(proposal.minimum_yes_proportion_of_total[0]?.basis_points ?? 300n);

  let isLoading = false;
  let showConfirm = false;
  let vote = "";
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
      const identityActor: any = await ActorFactory.createActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? ""
      );

      const { listNeurons, registerVote } =
        SnsGovernanceCanister.create(identityActor);
      let neurons = await listNeurons({ certified: false });

      neurons.forEach((neuron) => {
        const neuronId = neuron.id[0];

        if (!neuronId) {
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
        duration: 2000,
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
          <div class="mb-1 text-lg text-gray-400">Details</div>
          <div class="mt-3 text-base break-words">{proposal.proposal[0]?.summary}</div>
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
          <div class="absolute inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div class="p-6 rounded-lg bg-BrandBlack">
              <p class="mb-4 text-xl text-white">
                Are you sure you want to vote {vote} on proposal {proposal.id[0]?.id}?
              </p>
              <div class="flex justify-center gap-4">
                <button
                  class="px-4 py-2 rounded bg-BrandRed hover:opacity-90"
                  on:click={cancelModal}
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