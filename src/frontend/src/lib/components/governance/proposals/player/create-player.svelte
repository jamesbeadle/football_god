<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { countryStore } from "$lib/stores/country-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { convertDateInputToUnixNano } from "$lib/utils/helpers";
  import { toasts } from "$lib/stores/toasts-store";
  import { isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import DropdownSelect from "$lib/components/shared/dropdown-select.svelte";
    import type { Club, Country, League, PlayerPosition } from "../../../../../../../declarations/backend/backend.did";
    import type { CreatePlayer } from "../../../../../../../declarations/data_canister/data_canister.did";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  
  let leagues: League[] = [];
  let clubs: Club[] = [];
  let countries: Country[] = [];
  let positions = [
    { id: 1, name: "Goalkeeper" },
    { id: 2, name: "Defender" },
    { id: 3, name: "Midfielder" },
    { id: 4, name: "Forward" }
  ];

  let selectedPosition = 0;
  let firstName = "";
  let lastName = "";
  let dateOfBirth = "";
  let shirtNumber = 0;
  let value = 0;
  let nationalityId = 0;
  
  let isLoading = false;
  let leaguesLoaded = false;
  let submitting = false;
  let submitted = false;

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
      let countriesResult = await countryStore.getCountries();
      if(!countriesResult) throw new Error("Failed to fetch countries");
      countries = countriesResult.countries;
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error loading leagues")
      leagues  = leaguesResult.leagues;
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
    let clubsResult = await clubStore.getClubs(selectedLeagueId);
    if(!clubsResult) throw new Error("Error loading clubs")
    clubs = clubsResult.clubs;
  }

  async function confirmProposal() {

    if(submitted || submitting){
      return;
    }
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
    try{
        let dto: CreatePlayer = {
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

      submitting = true;

      let result = await governanceStore.createPlayer(dto);
      if (isError(result)) {
          isLoading = false;
          console.error("Error submitting proposal");
          return;
        }
        submitted = true;
        submitting = false;
        toasts.addToast({
          message: "Player proposal created successfully",
          type: "success",
          duration: 3000
        });
      } catch (error) {
        console.error("Error submitting proposal", error);
        toasts.addToast({
          message: "Error submitting proposal",
          type: "error",
        });
      }finally {
        isLoading = false;
        visible = false;
        resetForm();
        closeModal();
      }
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

<Modal title={"Create Player"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Select the player's league:">
      <DropdownSelect
        options={leagues.map(league => ({ id: league.id, label: league.name }))}
        value={selectedLeagueId}
        onChange={(value: string | number) => {
          selectedLeagueId = Number(value);
        }}
        scrollOnOpen={true}
      />
    </FormComponent>
    
    {#if selectedLeagueId > 0}
      <FormComponent label="Select the player's club:">
        <DropdownSelect
          options={clubs.map(club => ({ id: club.id, label: club.friendlyName }))}
          value={selectedClubId}
          onChange={(value: string | number) => {
            selectedClubId = Number(value);
          }}
          scrollOnOpen={true}
        />
      </FormComponent>
    {/if}
    {#if selectedClubId > 0}
      <FormComponent label="Select Position:">
        <DropdownSelect
          options={positions.map((position: any) => ({ id: position.id, label: position.name }))}
          value={selectedPosition}
          onChange={(value: string | number) => {
            selectedPosition = Number(value);
          }}
        />
      </FormComponent>
      
      <FormComponent label="First Name:">
        <input type="text" class="modal-input-box" placeholder="First Name" bind:value={firstName} />
      </FormComponent>
      
      <FormComponent label="Last Name:">
        <input type="text" class="modal-input-box" placeholder="Last Name" bind:value={lastName} />
      </FormComponent>
      
      <FormComponent label="Shirt Number:">
        <input
          type="number"
          class="modal-input-box"
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
        class="modal-input-box"
        placeholder="Value"
        bind:value
      />
      </FormComponent>
      
      <FormComponent label="Date of Birth:">
        <input
          type="date"
          bind:value={dateOfBirth}
          class="modal-input-box"
        />
      </FormComponent>
      
      <FormComponent label="Nationality:">
        <DropdownSelect
          options={countries.map(country => ({ id: country.id, label: country.name }))}
          value={nationalityId}
          onChange={(value: string | number) => {
            nationalityId = Number(value);
          }}
        />
      </FormComponent>
    {/if}
  </GovernanceModal>
</Modal>





