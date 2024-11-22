<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  import type { ClubDTO, FootballLeagueDTO, PlayerDTO, TransferPlayerDTO } from "../../../../../../declarations/backend/backend.did";
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
  
  let transferToLeagues: FootballLeagueDTO[] = [];
  let transferToClubs: ClubDTO[] = [];
  
  let transferToLeagueId: number = 0;
  let transferToClubId: number = 0;
  
  let shirtNumber: number = 0;
  
  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled =
  selectedLeagueId <= 0 || selectedClubId <= 0 || selectedPlayerId <= 0 ||
  transferToLeagueId <= 0 || transferToClubId <= 0

  $: if(selectedLeagueId) {
    getCurrentLeagueClubs();
  }

  $: if (selectedClubId) {
    getCurrentPlayers();
  }

  $: if(transferToLeagueId && transferToLeagueId > 0) {
    getToLeagueClubs();
  };
  
  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      currentLeagues = await leagueStore.getLeagues();
      transferToLeagues = currentLeagues;
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
    console.log("getting current players")
    console.log(`for league id ${selectedLeagueId}`)
    currentPlayers = (await playerStore.getPlayers(selectedLeagueId)).filter(x => x.clubId == selectedClubId);
  }

  async function getToLeagueClubs() {
    transferToClubs = await clubStore.getClubs(transferToLeagueId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: TransferPlayerDTO = {
      leagueId: selectedLeagueId,
      clubId: selectedClubId,
      newLeagueId: transferToLeagueId,
      playerId: selectedPlayerId,
      newClubId: transferToClubId,
      newShirtNumber: shirtNumber
    };
    await playerStore.transferPlayer(selectedLeagueId, dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    currentLeagues = [];
    currentClubs = [];
    currentPlayers = [];
    transferToLeagues = [];
    transferToClubs = [];
    selectedLeagueId = 0;
    selectedClubId = 0;
    selectedPlayerId = 0;
    transferToLeagueId = 0;
    transferToClubId = 0;
    shirtNumber = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Transfer Player</h3>
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
          <p>Select a player to transfer:</p>

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

          {#if selectedPlayerId > 0}
            <p>Please select players new league:</p>

            <select
              class="p-2 brand-dropdown min-w-[100px]"
              bind:value={transferToLeagueId}
            >
              <option value={0}>Select League</option>
              {#each transferToLeagues as league}
                <option value={league.id}>{league.name}</option>
              {/each}
            </select>

            {#if transferToLeagueId > 0}
  
              <select
                class="p-2 brand-dropdown min-w-[100px]"
                bind:value={transferToClubId}
              >
                <option value={0}>Select Club</option>
                {#each transferToClubs as club}
                  <option value={club.id}>{club.friendlyName}</option>
                {/each}
              </select>

              {#if transferToClubId > 0}
                <p class="py-2">Shirt Number:</p>

                <input
                  type="number"
                  class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Shirt Number"
                  min="1"
                  max="99"
                  step="1"
                  bind:value={shirtNumber}
                />
              {/if}
            {/if}

          {/if}

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