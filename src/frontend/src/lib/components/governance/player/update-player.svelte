<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import { convertDateInputToUnixNano, formatUnixToDateInputValue } from "$lib/utils/helpers";
  import { leagueStore } from "$lib/stores/league-store";
  import { countryStore } from "$lib/stores/country-store";
  import { playerStore } from "$lib/stores/player-store";
  import Modal from "$lib/components/shared/modal.svelte";
    import type { ClubDTO, CountryDTO, FootballLeagueDTO, PlayerDTO, UpdatePlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
    import type { PlayerPosition } from "../../../../../../declarations/backend/backend.did";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  export let selectedPlayerId: number = 0;
  
  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  let countries: CountryDTO[] = [];
  let players: PlayerDTO[] = []

  let selectedPosition = 0;
  let firstName = "";
  let lastName = "";
  let dateOfBirth = "";
  let shirtNumber = 0;
  let nationalityId = 0;
  
  let isLoading = false;
  let showConfirm = false;
  let leaguesLoaded = false;
  let playersLoaded = false;

  $: isSubmitDisabled =
    selectedLeagueId <= 0 ||
    selectedPlayerId <= 0 ||
    selectedClubId <= 0 ||
    nationalityId <= 0 ||
    lastName.length <= 0 ||
    lastName.length > 50 ||
    dateOfBirth == "" ||
    shirtNumber <= 0 ||
    shirtNumber > 99 ||
    selectedPosition <= 0
    nationalityId == 0;


  onMount(async () => {
    try {
      isLoading = true;
      countries = await countryStore.getCountries();
      leagues = await leagueStore.getLeagues();
      leaguesLoaded = true; 
      
      if (selectedLeagueId > 0) {
        await getClubs();
      }

      if(selectedClubId > 0){
        await getPlayers();
      }

      if(selectedPlayerId > 0){
        let player = players.find(x => x.id == selectedPlayerId);
        if(player == null){
          return;
        }

        let positionId = 0;

        if(Object.keys(player.position)[0] == "Goalkeeper"){
          positionId = 1;
        }

        if(Object.keys(player.position)[0] == "Defender"){
          positionId = 2;
        }

        if(Object.keys(player.position)[0] == "Midfielder"){
          positionId = 3;
        }

        if(Object.keys(player.position)[0] == "Forward"){
          positionId = 4;
        }
        selectedPosition = positionId;
        firstName = player?.firstName ?? "";
        lastName = player?.lastName ?? "";
        dateOfBirth = formatUnixToDateInputValue(Number(player?.dateOfBirth) ?? 0);
        shirtNumber = player?.shirtNumber ?? 0;
        nationalityId = player?.nationality ?? 0;
      }
    } catch (error) {
      console.error("Error mounting create player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if (leaguesLoaded && selectedLeagueId > 0) {
    getClubs();
  }

  $: if (leaguesLoaded && selectedClubId > 0) {
    playersLoaded = false;
    getPlayers();
    playersLoaded = true;
  }

  async function getClubs() {
    clubs = await clubStore.getClubs(selectedLeagueId);
  }

  async function getPlayers() {
    players = (await playerStore.getPlayers(selectedLeagueId)).filter(x => x.clubId == selectedClubId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;

    var position: PlayerPosition = { "Goalkeeper" : null };
    
    switch(selectedPosition){
      case 2:
        position = { "Defender" : null }
        break;
      case 3:
        position = { "Midfielder" : null}
        break;
      case 4:
        position = { "Forward" : null }
        break;

    }
    
    let dto: UpdatePlayerDTO = {
      leagueId: selectedLeagueId,
      playerId: selectedPlayerId,
      position,
      firstName,
      lastName,
      shirtNumber,
      dateOfBirth: convertDateInputToUnixNano(dateOfBirth),
      nationality: nationalityId
    };
    
    await playerStore.updatePlayer(selectedLeagueId, dto);

    closeModal();
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    selectedLeagueId = 0;
    selectedClubId = 0;
    selectedPosition = 0;
    clubs = [];
    firstName = "";
    lastName = "";
    dateOfBirth = "";
    shirtNumber = 0;
    nationalityId = 0;
    isLoading = false;
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Update Player</h3>
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

          <div class="flex-col space-y-2">
            <p>Select a player to update:</p>
            <select
              class="p-2 brand-dropdown my-4 min-w-[100px]"
              bind:value={selectedPlayerId}
            >
              <option value={0}>Select Player</option>
              {#each players as player}
                <option value={player.id}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>

          {#if playersLoaded && selectedPlayerId > 0}
            
            <div class="flex-col space-y-2">
              <p>Select Position:</p>
              <select
                class="p-2 brand-dropdown my-4 min-w-[100px]"
                bind:value={selectedPosition}
              >
                <option value={0}>Select Position</option>
                <option value={1}>Goalkeeper</option>
                <option value={2}>Defender</option>
                <option value={3}>Midfielder</option>
                <option value={4}>Forward</option>
              </select>
            </div>
            <div class="flex-col space-y-2">
              <p class="py-2">First Name:</p>
    
              <input
                type="text"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="First Name"
                bind:value={firstName}
              />
            </div>
            <div class="flex-col space-y-2">
              <p class="py-2">Last Name:</p>
    
              <input
                type="text"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Last Name"
                bind:value={lastName}
              />
            </div>
            <div class="flex-col space-y-2">
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
            </div>
            <div class="flex-col space-y-2">
              <p class="py-2">Date of Birth:</p>
    
              <input
                type="date"
                bind:value={dateOfBirth}
                class="brand-input"
              />
            </div>
            <div class="flex-col space-y-2">
              <p class="py-2">Nationality:</p>
    
              <select
                class="p-2 brand-dropdown min-w-[100px] mb-2"
                bind:value={nationalityId}
              >
                <option value={0}>Select Nationality</option>
                {#each countries as country}
                  <option value={country.id}>{country.name}</option>
                {/each}
              </select>
            </div>

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
      {/if}
    </div>
  </div>
</Modal>





