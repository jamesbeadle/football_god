<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { countryStore } from "$lib/stores/country-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { convertDateInputToUnixNano } from "$lib/utils/helpers";
  import type { ClubDTO, CountryDTO, CreatePlayerDTO, FootballLeagueDTO, PlayerPosition } from "../../../../../../declarations/data_canister/data_canister.did";
  
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
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
  let leaguesLoaded = false;

  $: isSubmitDisabled =
    selectedLeagueId <= 0 ||
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
      leagueId: selectedLeagueId,
      clubId: selectedClubId,
      position,
      firstName,
      lastName,
      shirtNumber,
      valueQuarterMillions: value * 4,
      dateOfBirth: convertDateInputToUnixNano(dateOfBirth),
      nationality: nationalityId
    };
    
    await governanceStore.createPlayer(dto);

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

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Create Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Select the player's league:">
      <select class="brand-dropdown" bind:value={selectedLeagueId}>
        <option value={0}>Select League</option>
        {#each leagues as league}
          <option value={league.id}>{league.name}</option>
        {/each}
      </select>
    </FormComponent>
    
    {#if selectedLeagueId > 0}
      <FormComponent label="Select the player's club:">
        <select class="brand-dropdown" bind:value={selectedClubId}>
          <option value={0}>Select Club</option>
          {#each clubs as club}
            <option value={club.id}>{club.friendlyName}</option>
          {/each}
        </select>
      </FormComponent>
    {/if}

    {#if selectedClubId > 0}
      <FormComponent label="Select Position:">
        <select class="brand-dropdown" bind:value={selectedPosition}>
          <option value={0}>Select Position</option>
          <option value={1}>Goalkeeper</option>
          <option value={2}>Defender</option>
          <option value={3}>Midfielder</option>
          <option value={4}>Forward</option>
        </select>
      </FormComponent>
      
      <FormComponent label="First Name:">
        <input type="text" class="brand-input" placeholder="First Name" bind:value={firstName} />
      </FormComponent>
      
      <FormComponent label="Last Name:">
        <input type="text" class="brand-input" placeholder="Last Name" bind:value={lastName} />
      </FormComponent>
      
      <FormComponent label="Shirt Number:">
        <input
          type="number"
          class="brand-input"
          placeholder="Shirt Number"
          min="1"
          max="99"
          step="1"
          bind:value={shirtNumber} />
      </FormComponent>
      
      <FormComponent label="Value (£m):">
        <input
        type="number"
        step="0.25"
        class="brand-input"
        placeholder="Value"
        bind:value
      />
      </FormComponent>
      
      <FormComponent label="Date of Birth:">
        <input
          type="date"
          bind:value={dateOfBirth}
          class="brand-input"
        />
      </FormComponent>
      
      <FormComponent label="Nationality:">
        <select
          class="brand-dropdown"
          bind:value={nationalityId}
        >
          <option value={0}>Select Nationality</option>
          {#each countries as country}
            <option value={country.id}>{country.name}</option>
          {/each}
        </select>
      </FormComponent>
    {/if}
  </GovernanceModal>
</Modal>





