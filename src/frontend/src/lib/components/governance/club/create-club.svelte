<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { CreateClub, ShirtType } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId: number;

  let isLoading = true;
  let submitting = false;
  let submitted = false;
  
  let name = "";
  let friendlyName = "";
  let abbreviatedName = "";
  let primaryColourHex = "";
  let secondaryColourHex = "";
  let thirdColourHex = "";
  let shirtType: ShirtType = { Filled: null };

  $: isSubmitDisabled =
    name.length <= 0 ||
    name.length > 100 ||
    friendlyName.length <= 0 ||
    friendlyName.length > 50 ||
    abbreviatedName.length != 3;

  let shirtTypes: ShirtType[] = [{ Filled: null }, { Striped: null }];

  onMount(async () => {
    try {
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }


    try {
      isLoading = true;
      let dto: CreateClub = {
        leagueId: selectedLeagueId,
        name,
        friendlyName,
        primaryColourHex,
        secondaryColourHex,
        thirdColourHex,
        abbreviatedName,
        shirtType
      }
      submitting = true;

      let result = await governanceStore.createClub(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }
      
      submitted = true;
      submitting = false;
    } catch (error) {
      console.error("Error raising proposal: ", error);
    } finally {
      isLoading = false;
      visible = false;
      resetForm();
      closeModal();
    }
  }

  function resetForm() {
    selectedLeagueId = 0;
    name = "";
    friendlyName = "";
    abbreviatedName = "";
    primaryColourHex = "";
    secondaryColourHex = "";
    thirdColourHex = "";
    shirtType = { Filled: null };
  }

  function handlePrimaryColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    primaryColourHex = input.value;
  }

  function handleSecondaryColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    secondaryColourHex = input.value;
  }

  function handleThirdColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    thirdColourHex = input.value;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Create Club"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Club Full Name:">
      <input class="brand-input" type="text" bind:value={name} placeholder="Club Full Name" />
    </FormComponent>

    <FormComponent label="Club Friendly Name:">
      <input class="brand-input" type="text" bind:value={friendlyName} placeholder="Club Friendly Name" />
    </FormComponent>

    <FormComponent label="Club Abbreviated Name:">
      <input class="brand-input" type="text" bind:value={abbreviatedName} placeholder="Abbreviated Name" />
    </FormComponent>

    <FormComponent label="Primary Club Colour:">
      <input class="brand-input" type="color" on:input={handlePrimaryColorChange} bind:value={primaryColourHex} />
    </FormComponent>

    <FormComponent label="Secondary Club Colour:">
      <input class="brand-input" type="color" on:input={handleSecondaryColorChange} bind:value={secondaryColourHex} />
    </FormComponent>

    <FormComponent label="Third Club Colour:">
      <input class="brand-input" type="color" on:input={handleThirdColorChange} bind:value={thirdColourHex} />
    </FormComponent>

    <FormComponent label="Shirt Type:">
      <select class="brand-dropdown" bind:value={shirtType}>
        {#each shirtTypes as shirt}
          <option value={shirt}>{Object.keys(shirt)[0]}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>
