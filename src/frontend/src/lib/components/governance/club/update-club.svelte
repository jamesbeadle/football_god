<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import type { Club, LeagueId, ShirtType, UpdateClub } from "../../../../../../declarations/data_canister/data_canister.did";
  import { isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedClub: Club;
  export let selectedLeagueId: LeagueId;

  let name = "";
  let friendlyName = "";
  let abbreviatedName = "";
  let primaryColourHex = "";
  let secondaryColourHex = "";
  let thirdColourHex = "";
  let shirtType: ShirtType = { Filled: null };

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  $: isSubmitDisabled =
    selectedClub == null ||
    name.length <= 0 ||
    name.length > 100 ||
    friendlyName.length <= 0 ||
    friendlyName.length > 50 ||
    abbreviatedName.length != 3;

  let shirtTypes: ShirtType[] = [{ Filled: null }, { Striped: null }];

  onMount(async () => {
    
    try {
      name = selectedClub.name;
      friendlyName = selectedClub.friendlyName;
      abbreviatedName = selectedClub.abbreviatedName;
      primaryColourHex = selectedClub.primaryColourHex;
      secondaryColourHex = selectedClub.secondaryColourHex;
      thirdColourHex = selectedClub.thirdColourHex;
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
      let dto: UpdateClub = {
        leagueId: selectedLeagueId,
        clubId: selectedClub.id,
        name,
        friendlyName,
        primaryColourHex,
        secondaryColourHex,
        thirdColourHex,
        abbreviatedName,
        shirtType
      }
      submitting = true;

      let result = await governanceStore.updateClub(dto);
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
  <GovernanceModal title={"Update Club"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Club Full Name:">
      <input
        type="text"
        class="brand-input"
        placeholder="Club Full Name"
        bind:value={name}
      />
    </FormComponent>
    
    <FormComponent label="Club Friendly Name:">
      <input
        type="text"
        class="brand-input"
        placeholder="Club Friendly Name"
        bind:value={friendlyName}
      />
    </FormComponent>

    <FormComponent label="Abbreviated Name">
      <input
        type="text"
        class="brand-input"
        placeholder="Abbreviated Name"
        bind:value={abbreviatedName}
      />
    </FormComponent>

    <FormComponent label="Primary Colour:">
      <input
        type="color"
        bind:value={primaryColourHex}
        on:input={handlePrimaryColorChange}
        class="brand-input"
      />
    </FormComponent>

    <FormComponent label="Secondary Colour:">
      <input
        type="color"
        bind:value={secondaryColourHex}
        on:input={handleSecondaryColorChange}
        class="brand-input"
      />
    </FormComponent>
    <FormComponent label="Third Colour:">
      <input
        type="color"
        bind:value={thirdColourHex}
        on:input={handleThirdColorChange}
        class="brand-input"
      />
    </FormComponent>
    <FormComponent label="Shirt Type:">
      <select
        class="brand-dropdown"
        bind:value={shirtType}
        >
        {#each shirtTypes as shirt}
          <option value={shirt}>{shirt}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>