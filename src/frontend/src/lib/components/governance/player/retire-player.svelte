<script lang="ts">
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player-store";
  //import { governanceStore } from "$lib/stores/governance-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import Modal from "$lib/components/shared/modal.svelte";
    import type { ClubDTO, PlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId = 0;

  let selectedClubId: number = 0;
  let selectedPlayerId: number = 0;
  let retirementDate: string = "";
  let clubs: ClubDTO[] = [];
  let clubPlayers: PlayerDTO[] = [];

  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled = selectedPlayerId <= 0 || retirementDate == "";

  $: if (selectedClubId) {
    getClubPlayers();
  }

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function getClubPlayers() {
    clubPlayers = (await playerStore.getPlayers(selectedLeagueId)).filter((x) => x.clubId == selectedClubId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    /*
    let result = await governanceStore.retirePlayer(
      selectedPlayerId,
      retirementDate
    );
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
      */
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    selectedClubId = 0;
    selectedPlayerId = 0;
    retirementDate = "";
    showConfirm = false;
    clubPlayers = [];
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Retire Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <p>Select the player's club:</p>

        <select
          class="p-2 brand-dropdown min-w-[100px]"
          bind:value={selectedClubId}
        >
          <option value={0}>Select Club</option>
          {#each clubs as club}
            <option value={club.id}>{club.friendlyName}</option>
          {/each}
        </select>

        {#if selectedClubId > 0}
          <p>Select a player to retire:</p>

          <select
            class="p-2 brand-dropdown my-4 min-w-[100px]"
            bind:value={selectedPlayerId}
          >
            <option value={0}>Select Player</option>
            {#each clubPlayers as player}
              <option value={player.id}
                >{player.firstName} {player.lastName}</option
              >
            {/each}
          </select>

          <p>Retirement Date:</p>

          <input
            type="date"
            bind:value={retirementDate}
            class="brand-dropdown"
          />
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

    {#if isLoading}
      <LocalSpinner />
    {/if}
  </div>
</Modal>