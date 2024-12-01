<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  import type { ClubDTO, FootballLeagueDTO, PlayerDTO, SetFreeAgentDTO } from "../../../../../../declarations/backend/backend.did";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  export let selectedPlayerId: number = 0;

  let currentLeagues: FootballLeagueDTO[] = [];
  let currentClubs: ClubDTO[] = [];
  let currentPlayers: PlayerDTO[] = [];
  
  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled =
  selectedLeagueId <= 0 || selectedClubId <= 0 || selectedPlayerId <= 0

  $: if(selectedLeagueId) {
    getCurrentLeagueClubs();
  }

  $: if (selectedClubId) {
    getCurrentPlayers();
  }
  
  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      currentLeagues = await leagueStore.getLeagues();
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function getCurrentLeagueClubs() {
    currentClubs = await clubStore.getClubs(selectedLeagueId);
  }

  async function getCurrentPlayers() {
    currentPlayers = (await playerStore.getPlayers(selectedLeagueId)).filter(x => x.clubId == selectedClubId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: SetFreeAgentDTO = {
      leagueId: selectedLeagueId,
      clubId: selectedClubId,
      playerId: selectedPlayerId
    };
    await playerStore.setFreeAgent(selectedLeagueId, dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    currentLeagues = [];
    currentClubs = [];
    currentPlayers = [];
    selectedLeagueId = 0;
    selectedClubId = 0;
    selectedPlayerId = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Set Player as Free Agent</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <p>Select the player's league:</p>

        <select
          class="p-2 brand-dropdown min-w-[100px]"
          bind:value={selectedLeagueId}
        >
          <option value={0}>Select League</option>
          {#each currentLeagues as league}
            <option value={league.id}>{league.name}</option>
          {/each}
        </select>

        {#if selectedLeagueId > 0}
          <p>Select the player's club:</p>

          <select
            class="p-2 brand-dropdown min-w-[100px]"
            bind:value={selectedClubId}
          >
            <option value={0}>Select Club</option>
            {#each currentClubs as club}
              <option value={club.id}>{club.friendlyName}</option>
            {/each}
          </select>
        {/if}

        {#if selectedClubId > 0}
          <p>Select player to set as free agent:</p>

          <select
            class="p-2 brand-dropdown my-4 min-w-[100px]"
            bind:value={selectedPlayerId}
          >
            <option value={0}>Select Player</option>
            {#each currentPlayers as player}
              <option value={player.id}
                >{player.firstName} {player.lastName}</option
              >
            {/each}
          </select>

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