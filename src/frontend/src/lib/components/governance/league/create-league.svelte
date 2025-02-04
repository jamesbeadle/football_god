<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { leagueStore } from "$lib/stores/league-store";
  
  import Modal from "$lib/components/shared/modal.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import type { CountryDTO, CreateLeagueDTO, Gender } from "../../../../../../declarations/data_canister/data_canister.did";
    import { governanceStore } from "$lib/stores/governance-store";
  
  export let visible: boolean;
  export let closeModal: () => void;
  
  let leagueName = "";
  let abbreviatedName = "";
  let governingBody = "";
  let selectedGender = 0;
  let dateFormed = "";
  let countryId = 0;
  let logo: Uint8Array | number[] = [];
  let fileInput: HTMLInputElement;
  let teamCount: 0;
  let countries: CountryDTO[] = [];

  let isLoading = true;
  let showConfirm = false;

  $: isSubmitDisabled =
    leagueName.length <= 0 ||
    leagueName.length > 100 ||
    abbreviatedName.length <= 0 ||
    abbreviatedName.length > 50 ||
    governingBody.length <= 0 ||
    governingBody.length > 50 ||
    dateFormed.length <= 0 ||
    dateFormed.length > 50 ||
    selectedGender < 1 ||
    selectedGender > 2 ||
    countryId <= 0;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try { 
      countries = await countryStore.getCountries();
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 500 * 1024) {
        alert("File size exceeds 500KB");
        return;
      }
      logo = await convertFileToUint8Array(file);
    }
  }

  function convertFileToUint8Array(file: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        } else {
          reject("Failed to read file");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    
    var leagueGender: Gender = { "Male" : null };
    if(selectedGender == 2){
      leagueGender = { "Female" : null };
    }
    
    const dto: CreateLeagueDTO = {
      name: leagueName,
      abbreviation: abbreviatedName,
      governingBody,
      relatedGender: leagueGender,
      formed: BigInt(new Date(dateFormed).getTime() * 1_000_000),
      countryId,
      logo: [logo],
      teamCount: teamCount
    };

    await governanceStore.createLeague(dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    leagueName = "";
    abbreviatedName = "";
    governingBody = "";
    selectedGender = 0;
    dateFormed = "";
    countryId = 0;
    logo = [];
    countries = [];
    showConfirm = false;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-2 p-2">
    <div class="flex justify-between items-center mb-2">
      <h3 class="default-header">Create League</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2 flex space-y-2">



          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">League Name:</p>
            <input class="w-1/2 brand-input" placeholder="League Name" type="text" bind:value={leagueName} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Abbreviated Name:</p>
            <input class="w-1/2 brand-input" placeholder="Abbreviated Name" type="text" bind:value={abbreviatedName} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Governing Body:</p>
            <input class="w-1/2 brand-input" placeholder="Governing Body" type="text" bind:value={governingBody} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Gender:</p>
            <select bind:value={selectedGender} class="w-1/2 brand-dropdown">
              <option value="0">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Team Count:</p>
            <input class="w-1/2 brand-input" placeholder="Team Count" type="number" bind:value={teamCount} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Date Formed:</p>
            <input class="w-1/2 brand-input" placeholder="Date Formed" type="date" bind:value={dateFormed} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Country:</p>
            <select bind:value={countryId} class="w-1/2 brand-dropdown">
              <option value={0}>Select League Country</option>
              {#each countries as country}
              <option value={country.id}>{country.name}</option>
              {/each}
            </select>
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">Logo:</p>
            <input
              type="file"
              id="logo-image"
              accept="image/*"
              class="w-1/2 p-2"
              bind:this={fileInput}
              on:change={handleFileChange}
            />
          </div>

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
