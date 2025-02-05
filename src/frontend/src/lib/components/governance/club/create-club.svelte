<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { CountryDTO, CreateClubDTO, ShirtType } from "../../../../../../declarations/data_canister/data_canister.did";
  import { isError } from "$lib/utils/helpers";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId: number;

  let isLoading = true;
  
  let name = "";
  let friendlyName = "";
  let abbreviatedName = "";
  let primaryColourHex = "";
  let secondaryColourHex = "";
  let thirdColourHex = "";
  let shirtType: ShirtType = { Filled: null };
  let countries: CountryDTO[] = [];

  let showConfirm = false;

  $: isSubmitDisabled =
    name.length <= 0 ||
    name.length > 100 ||
    friendlyName.length <= 0 ||
    friendlyName.length > 50 ||
    abbreviatedName.length != 3;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  let shirtTypes: ShirtType[] = [{ Filled: null }, { Striped: null }];

  onMount(async () => {
    try {
      countries = await countryStore.getCountries();
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: CreateClubDTO = {
      leagueId: selectedLeagueId,
      name,
      friendlyName,
      primaryColourHex,
      secondaryColourHex,
      thirdColourHex,
      abbreviatedName,
      shirtType
    }

    let result = await governanceStore.createClub(dto);
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
    isLoading = false;
    resetForm();
    closeModal();
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
  <div class="mx-2 p-2">
    <div class="flex justify-between items-center mb-2">
      <h3 class="default-header">Create Club</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2 flex space-y-2">


          <div class="flex flex-row w-full items-center">
            <p class="w-full">Club Full Name:</p>
            <input class="w-full brand-input" type="text" bind:value={name} placeholder="Club Full Name" />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-full">Club Friendly Name:</p>
            <input class="w-full brand-input" type="text" bind:value={friendlyName} placeholder="Club Friendly Name" />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-full">Club Abbreviated Name:</p>
            <input class="w-full brand-input" type="text" bind:value={abbreviatedName} placeholder="Abbreviated Name" />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-full">Primary Club Colour:</p>
            <input class="w-full brand-input" type="color" on:input={handlePrimaryColorChange} bind:value={primaryColourHex} placeholder="Abbreviated Name" />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-full">Secondary Club Colour:</p>
            <input class="w-full brand-input" type="color" on:input={handleSecondaryColorChange} bind:value={secondaryColourHex} placeholder="Abbreviated Name" />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-full">Third Club Colour:</p>
            <input class="w-full brand-input" type="color" on:input={handleThirdColorChange} bind:value={thirdColourHex} placeholder="Abbreviated Name" />
          </div>

          <select class="brand-dropdown w-full" bind:value={shirtType}>
            {#each shirtTypes as shirt}
              <option value={shirt}>{Object.keys(shirt)[0]}</option>
            {/each}
          </select>

          <div class="items-center flex flex-row space-x-4 w-full">
            <button
              class="brand-cancel-button w-1/2"
              type="button"
              on:click={cancelModal}
            >
              Cancel
            </button>
            <button
              class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} w-1/2`}
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
