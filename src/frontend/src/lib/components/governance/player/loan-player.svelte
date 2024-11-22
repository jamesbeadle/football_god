<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import type { ClubDTO, FootballLeagueDTO, LoanPlayerDTO, PlayerDTO } from "../../../../../../declarations/backend/backend.did";
  import { convertDateInputToUnixNano } from "$lib/utils/helpers";
  import { adminStore } from "$lib/stores/admin-store";
  import { leagueStore } from "$lib/stores/league-store";
    import Modal from "$lib/components/shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  export let selectedPlayerId: number = 0;
  
  let loanLeagueId: number = 0;
  let loanClubId: number = 0;

  let date = "";

  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  let clubPlayers: PlayerDTO[] = [];
  let loanClubs: ClubDTO[] = [];

  let isLoading = false;
  let showConfirm = false;
  let leaguesLoaded = false;

  $: isSubmitDisabled =
    selectedPlayerId <= 0 ||
    (selectedLeagueId <= 0 && selectedClubId <= 0) ||
    date == "";

  onMount(async () => {
    try {
      console.log("mounting")
      console.log(`selected player id ${selectedPlayerId}`)
      console.log(`selected club id ${selectedClubId}`)
      console.log(`selected league id ${selectedLeagueId}`)
      isLoading = true;
      leagues = await leagueStore.getLeagues();
      leaguesLoaded = true; 
      
      if (selectedLeagueId > 0) {
        // Set the selected league and fetch clubs
        await getClubs();
      }
      
      if (selectedLeagueId > 0 && selectedClubId > 0) {
        await getClubPlayers();
      }
    } catch (error) {
      console.error("Error mounting loan player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if (leaguesLoaded && selectedLeagueId > 0) {
    getClubs();
  }

  $: if (leaguesLoaded && selectedLeagueId > 0 && selectedClubId > 0) {
    getClubPlayers();
  }

  $: if(loanLeagueId > 0){
    getLoanClubs();
  };

  async function getClubs() {
    clubs = await clubStore.getClubs(selectedLeagueId);
  }

  async function getLoanClubs() {
    loanClubs = await clubStore.getClubs(loanLeagueId);
  }

  async function getClubPlayers() {
    clubPlayers = (await playerStore.getPlayers(selectedLeagueId)).filter(
      (x) => x.clubId == selectedClubId
    );
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    
    let dto: LoanPlayerDTO = {
      loanEndDate: convertDateInputToUnixNano(date),
      playerId: selectedPlayerId,
      loanClubId: loanClubId,
      loanLeagueId: loanLeagueId
    };
    
    await adminStore.loanPlayer(selectedLeagueId, dto);

    closeModal();
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    selectedClubId = 0;
    selectedPlayerId = 0;
    clubPlayers = [];
    isLoading = false;
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Loan Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2">
          <p>Select the player's league:</p>

          <select
            class="p-2 brand-dropdown min-w-[100px]"
            bind:value={selectedLeagueId}
          >
            <option value={0}>Select League</option>
            {#each leagues as league}
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
              {#each clubs as club}
                <option value={club.id}>{club.friendlyName}</option>
              {/each}
            </select>
          {/if}

          {#if selectedClubId > 0}
            <p>Select a player to loan:</p>

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

            {#if selectedPlayerId > 0}
              <p>Please select players loan club league:</p>

              <select
                class="p-2 brand-dropdown min-w-[100px]"
                bind:value={loanLeagueId}
              >
                <option value={0}>Select League</option>
                {#each leagues as league}
                  <option value={league.id}>{league.name}</option>
                {/each}
              </select>

              {#if loanLeagueId > 0}
    
                <select
                  class="p-2 brand-dropdown min-w-[100px]"
                  bind:value={loanClubId}
                >
                  <option value={0}>Select Club</option>
                  {#each loanClubs as club}
                    <option value={club.id}>{club.friendlyName}</option>
                  {/each}
                </select>

                {#if loanClubId > 0}
                  <div class="flex flex-row my-2">
                    <p class="mr-2">Select Date:</p>
                    <input type="date" bind:value={date} class="brand-input" />
                  </div>

                {/if}
              {/if}

            {/if}

          {/if}

          <div class="border-b border-gray-200" />

          <div class="items-center flex space-x-4">
            <button
              class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]"
              type="button"
              on:click={cancelModal}
            >
              Cancel
            </button>
            <button
              class={`${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                          px-4 py-2 default-button min-w-[150px]`}
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
                class={`${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                              px-4 py-2 default-button w-full`}
                on:click={confirmProposal}
                disabled={isSubmitDisabled}
              >
                Confirm Submit Proposal
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</Modal>





