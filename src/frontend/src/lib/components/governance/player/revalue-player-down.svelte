<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  //import { governanceStore } from "$lib/stores/governance-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import { isError } from "$lib/utils/helpers";
    import type { ClubDTO, PlayerDTO } from "../../../../../../declarations/backend/backend.did";
    import Modal from "$lib/components/shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  let selectedLeagueId: number = 0;
  let selectedClubId: number = 0;
  let selectedPlayerId: number = 0;
  let clubs: ClubDTO[] = [];
  let clubPlayers: PlayerDTO[] = [];

  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled = selectedPlayerId <= 0;

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
      console.error("Error mounting revalue down modal.", error);
    } finally {
      isLoading = false;
    }
  });

  async function getClubPlayers() {
    let leaguePlayers = await playerStore.getPlayers(selectedLeagueId);
    clubPlayers = leaguePlayers.filter((x) => x.clubId == selectedClubId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    /*
    let result = await governanceStore.revaluePlayerDown(selectedPlayerId);
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
      <h3 class="default-header">Revalue Player Down</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <div class="flex-col space-y-2">
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
        </div>
        {#if selectedClubId > 0}
          <div class="flex-col space-y-2">
            <p>Select a player to revalue down by £0.25m:</p>
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
          </div>
        {/if}

        {#if selectedPlayerId > 0}
          <p>
            Current Value: <b
              >£{(
                (clubPlayers.find((x) => x.id == selectedPlayerId)
                  ?.valueQuarterMillions ?? 0) / 4
              ).toFixed(2)}m</b
            >
          </p>
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