<script lang="ts">
  import { onMount } from "svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, PlayerDTO, RevaluePlayerDownDTO } from "../../../../../../declarations/data_canister/data_canister.did";
    import { governanceStore } from "$lib/stores/governance-store";
    import { isError } from "$lib/utils/helpers";

  export let visible: boolean;
  export let closeModal: () => void;
  export let player: PlayerDTO;
  export let club: ClubDTO;

  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled = false;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      isLoading = false;
    } catch (error) {
      console.error("Error mounting revalue down modal.", error);
    } finally {
      isLoading = false;
    }
  });

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    var dto: RevaluePlayerDownDTO = {
        leagueId: player.leagueId,
        playerId: player.id,
      };
    let result = await governanceStore.revaluePlayerDown(dto);
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    showConfirm = false;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    {#if isLoading}
      <LocalSpinner />
    {:else}
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Revalue Player Down</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>

      <div class="flex justify-start items-center w-full">
        <div class="w-full flex-col space-y-4 mb-2">
          
          {#if player}
            <p>Raise proposal to decrease the value of {player.firstName} {player.lastName} ({club.friendlyName}) by £0.25?</p>
          {/if}
        

          <div class="items-center flex space-x-4">
            <button
              class="px-4 py-2 brand-cancel-button min-w-[150px]"
              type="button"
              on:click={cancelModal}
            >
              Cancel
            </button>
            <button
              class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                px-4 py-2 min-w-[150px]`}
              on:click={raiseProposal}
              disabled={isSubmitDisabled}
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
                class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                              px-4 py-2 w-full`}
                on:click={confirmProposal}
                disabled={isSubmitDisabled}
              >
                Confirm Submit Proposal
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</Modal>