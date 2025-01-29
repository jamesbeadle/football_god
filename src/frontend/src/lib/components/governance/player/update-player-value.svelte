<script lang="ts">
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player-store";
  import type { ClubDTO, FootballLeagueDTO, PlayerDTO, SetFreeAgentDTO } from "../../../../../../declarations/backend/backend.did";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  export let player: PlayerDTO;

  let updatedValue = 0;
  
  let isLoading = false;
  let showConfirm = false;

  onMount(async () => {
    try {
      updatedValue = player.valueQuarterMillions;
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    await playerStore.updatePlayerValue(player.id, updatedValue);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    updatedValue = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Update Player Value</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <p>Update {player}</p>



        <div class="items-center flex space-x-4">
          <button
            class="px-4 py-2 brand-cancel-button min-w-[150px]"
            type="button"
            on:click={cancelModal}
          >
            Cancel
          </button>
          <button
            class="brand-button px-4 py-2 min-w-[150px]"
            on:click={raiseProposal}
          >
            Raise Proposal
          </button>
        </div>

        {#if showConfirm}
          <div class="items-center flex">
            <p class="text-orange-400">
              Failed proposals will cost the proposer 10 $FPL tokens.
            </p>
          </div>
          <div class="items-center flex">
            <button
              class="brand-button px-4 py-2 w-full"
              on:click={confirmProposal}
            >
              Confirm Submit Proposal
            </button>
          </div>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <LocalSpinner />
    {/if}
  </div>
</Modal>