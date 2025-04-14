<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { convertDateInputToUnixNano, formatUnixToDateInputValue } from "$lib/utils/helpers";
  import { governanceStore } from "$lib/stores/governance-store";
  import { toasts } from "$lib/stores/toasts-store";
  import { isError } from "$lib/utils/helpers";
  import type { Country, Player, PlayerPosition } from "../../../../../../../declarations/backend/backend.did";
  import type { UpdatePlayer } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
  }

  let { visible, closeModal, selectedPlayer }: Props = $props();
  
  let countries: Country[] = $state([]);

  let selectedPosition = $state(0);
  let firstName = $state("");
  let lastName = $state("");
  let dateOfBirth = $state("");
  let shirtNumber = $state(0);
  let nationalityId = $state(0);
  
  let isLoading = $state(false);
  let positions = [
    { id: 1, name: "Goalkeeper" },
    { id: 2, name: "Defender" },
    { id: 3, name: "Midfielder" },
    { id: 4, name: "Forward" }
  ];

  let isSubmitDisabled = $state(true);
  $effect(() => { 
    isSubmitDisabled =
    nationalityId <= 0 ||
    lastName.length <= 0 ||
    lastName.length > 50 ||
    dateOfBirth == "" ||
    shirtNumber <= 0 ||
    shirtNumber > 99 ||
    selectedPosition <= 0
    nationalityId == 0;
  });


  onMount(async () => {
    try {
      isLoading = true;
      let countriesResult = await countryStore.getCountries();
      if(!countriesResult) throw new Error("Failed to fetch countries");
      countries = countriesResult.countries;
      
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
      console.error("Error mounting update player modal.", error);
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
    try{
      let dto: UpdatePlayer = {
        leagueId: selectedPlayer.leagueId,
        playerId: selectedPlayer.id,
        position,
        firstName,
        lastName,
        shirtNumber,
        dateOfBirth: convertDateInputToUnixNano(dateOfBirth),
        nationality: nationalityId
      };

      let result = await governanceStore.updatePlayer(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }

      toasts.addToast({
        message: "Update player proposal created successfully",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Error submitting proposal", error);
      toasts.addToast({
        message: "Error submitting proposal",
        type: "error",
      });
    } finally {
      isLoading = false;
      visible = false;
      closeModal();
    }
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

<Modal title={"Update Player"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>

    <FormComponent label="Select Position:">
      <select class="brand-dropdown" bind:value={selectedPosition}>
        {#each positions.map((position: any) => ({ id: position.id, label: position.name })) as position}
          <option value={position.id}>{position.label}</option>
        {/each}
      </select>
    </FormComponent>

    <FormComponent label="First Name:">
      <input
        type="text"
        class="modal-input-box"
        placeholder="First Name"
        bind:value={firstName}
      />
    </FormComponent>

    <FormComponent label="Last Name:">
      <input
        type="text"
        class="modal-input-box"
        placeholder="Last Name"
        bind:value={lastName}
      />
    </FormComponent>

    <FormComponent label="Shirt Number:">
      <input
        type="number"
        class="modal-input-box"
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
        class="modal-input-box"
      />
    </FormComponent>

    <FormComponent label="Nationality:">
      <select class="brand-dropdown" bind:value={nationalityId}>
        {#each countries.map((country: Country) => ({ id: country.id, label: country.name })) as country}
          <option value={country.id}>{country.label}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>





