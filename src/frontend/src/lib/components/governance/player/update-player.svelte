<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { playerStore } from "$lib/stores/player-store";
  import type { PlayerPosition } from "../../../../../../declarations/backend/backend.did";
  import { convertDateInputToUnixNano, formatUnixToDateInputValue } from "$lib/utils/helpers";
  import type { CountryDTO, PlayerDTO, UpdatePlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedPlayer: PlayerDTO;
  
  let countries: CountryDTO[] = [];

  let selectedPosition = 0;
  let firstName = "";
  let lastName = "";
  let dateOfBirth = "";
  let shirtNumber = 0;
  let nationalityId = 0;
  
  let isLoading = false;

  $: isSubmitDisabled =
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
      
      let positionId = 0;

      if(Object.keys(selectedPlayer.position)[0] == "Goalkeeper"){
        positionId = 1;
      }

      if(Object.keys(selectedPlayer.position)[0] == "Defender"){
        positionId = 2;
      }

      if(Object.keys(selectedPlayer.position)[0] == "Midfielder"){
        positionId = 3;
      }

      if(Object.keys(selectedPlayer.position)[0] == "Forward"){
        positionId = 4;
      }
      selectedPosition = positionId;
      firstName = selectedPlayer?.firstName ?? "";
      lastName = selectedPlayer?.lastName ?? "";
      dateOfBirth = formatUnixToDateInputValue(Number(selectedPlayer?.dateOfBirth) ?? 0);
      shirtNumber = selectedPlayer?.shirtNumber ?? 0;
      nationalityId = selectedPlayer?.nationality ?? 0;
    } catch (error) {
      console.error("Error mounting create player modal.", error);
    } finally {
      isLoading = false;
    }
  });

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
      leagueId: selectedPlayer.leagueId,
      playerId: selectedPlayer.id,
      position,
      firstName,
      lastName,
      shirtNumber,
      dateOfBirth: convertDateInputToUnixNano(dateOfBirth),
      nationality: nationalityId
    };
    
    await playerStore.updatePlayer(selectedPlayer.leagueId, dto);

    closeModal();
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    selectedPosition = 0;
    firstName = "";
    lastName = "";
    dateOfBirth = "";
    shirtNumber = 0;
    nationalityId = 0;
    isLoading = false;
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Update Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>

    <FormComponent label="Select Position:">
      <select
        class="brand-dropdown"
        bind:value={selectedPosition}
      >
        <option value={0}>Select Position</option>
        <option value={1}>Goalkeeper</option>
        <option value={2}>Defender</option>
        <option value={3}>Midfielder</option>
        <option value={4}>Forward</option>
      </select>
    </FormComponent>

    <FormComponent label="First Name:">
      <input
        type="text"
        class="brand-input"
        placeholder="First Name"
        bind:value={firstName}
      />
    </FormComponent>

    <FormComponent label="Last Name:">
      <input
        type="text"
        class="brand-input"
        placeholder="Last Name"
        bind:value={lastName}
      />
    </FormComponent>

    <FormComponent label="Shirt Number:">
      <input
        type="number"
        class="brand-input"
        placeholder="Shirt Number"
        min="1"
        max="99"
        step="1"
        bind:value={shirtNumber}
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
  </GovernanceModal>
</Modal>





