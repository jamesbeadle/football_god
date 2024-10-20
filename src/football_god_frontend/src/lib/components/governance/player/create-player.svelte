<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { Modal } from "@dfinity/gix-components";
  import LocalSpinner from "$lib/components/local-spinner.svelte";
  import { toastsError } from "$lib/stores/toasts-store";
  import type { ClubDTO, CountryDTO, CreatePlayerDTO, FootballLeagueDTO, PlayerPosition } from "../../../../../../declarations/football_god_backend/football_god_backend.did";
  import { convertDateInputToUnixNano } from "$lib/utils/helpers";
  import { adminStore } from "$lib/stores/admin-store";
  import { leagueStore } from "$lib/stores/league-store";
    import { countryStore } from "$lib/stores/country-store";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  
  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  let countries: CountryDTO[] = [];

  let selectedPosition = 0;
  let firstName = "";
  let lastName = "";
  let dateOfBirth = "";
  let shirtNumber = 0;
  let value = 0;
  let nationalityId = 0;
  
  let isLoading = false;
  let showConfirm = false;
  let leaguesLoaded = false;

  $: isSubmitDisabled =
    selectedClubId <= 0 ||
    nationalityId <= 0 ||
    lastName.length <= 0 ||
    lastName.length > 50 ||
    dateOfBirth == "" ||
    shirtNumber <= 0 ||
    shirtNumber > 99 ||
    selectedPosition <= 0
    value <= 0 ||
    value > 200 ||
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
    } catch (error) {
      toastsError({
        msg: { text: "Error mounting create player modal." },
        err: error,
      });
      console.error("Error mounting create player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if (leaguesLoaded && selectedLeagueId > 0) {
    getClubs();
  }

  async function getClubs() {
    clubs = await clubStore.getClubs(selectedLeagueId);
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
    
    let dto: CreatePlayerDTO = {
      clubId: selectedClubId,
      position,
      firstName,
      lastName,
      shirtNumber,
      valueQuarterMillions: value * 4,
      dateOfBirth: convertDateInputToUnixNano(dateOfBirth),
      nationality: nationalityId
    };
    
    await adminStore.createPlayer(selectedLeagueId, dto);

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
    value = 0;
    nationalityId = 0;
    isLoading = false;
  }
</script>

<Modal {visible} on:nnsClose={cancelModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Create Player</h3>
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
              placeholder="First Name"
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
            <p class="py-2">Value (£m):</p>
  
            <input
              type="number"
              step="0.25"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Value"
              bind:value
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





