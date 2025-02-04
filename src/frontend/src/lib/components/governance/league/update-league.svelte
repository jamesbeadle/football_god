<script lang="ts">
  import { LeagueService } from "$lib/services/league-service";
  import { countryStore } from "$lib/stores/country-store";
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { getDateFromBigInt } from "$lib/utils/helpers";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import Modal from "$lib/components/shared/modal.svelte";
    import type { CountryDTO, FootballLeagueDTO, Gender, UpdateLeagueDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  
  export let visible: boolean;
  export let closeModal: () => void;
  
  let leagues: FootballLeagueDTO[] = [];
  let selectedLeagueId: number = 0;

  let leagueName = "";
  let abbreviatedName = "";
  let governingBody = "";
  let gender: Gender = { "Male" : null };
  let dateFormed = "";
  let countryId = 0;
  let logo: Uint8Array | number[];
  let fileInput: HTMLInputElement;
  let teamCount: 0;
  let countries: CountryDTO[] = [];

  let isLoading = true;
  let showConfirm = false;

  $: isSubmitDisabled =
    selectedLeagueId <= 0 ||
    leagueName.length <= 0 ||
    leagueName.length > 100 ||
    abbreviatedName.length <= 0 ||
    abbreviatedName.length > 50 ||
    governingBody.length <= 0 ||
    governingBody.length > 50 ||
    dateFormed.length <= 0 ||
    dateFormed.length > 50 ||
    countryId <= 0;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  $: if(selectedLeagueId && selectedLeagueId > 0) {
    setLeague();
  }

  onMount(async () => {
    try {
      leagues = await leagueStore.getLeagues();   
      countries = await countryStore.getCountries();
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function setLeague(){
    let league = leagues.find(x => x.id == selectedLeagueId);
    if(league == null){
      return;
    }
    leagueName = league.name;
    abbreviatedName = league.abbreviation;
    governingBody = league.governingBody;
    gender = league.relatedGender;
    dateFormed = getDateFromBigInt(Number(league?.formed ?? 0n));
    countryId = league.countryId;
    logo =  league.logo;
  }

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

  function clickFileInput(event: Event) {
    event.preventDefault();
    fileInput.click();
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
    const dto: UpdateLeagueDTO = {
        leagueId: selectedLeagueId,
        name: leagueName,
        abbreviation: abbreviatedName,
        governingBody,
        relatedGender: gender,
        formed: BigInt(new Date(dateFormed).getTime() * 1_000_000),
        countryId,
        logo: logo,
        teamCount: teamCount
      };

      await new LeagueService().updateLeague(dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    
    selectedLeagueId = 0;
    leagueName = "";
    abbreviatedName = "";
    governingBody = "";
    gender = { "Male" : null };
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
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Transfer Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <p>Select league:</p>

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
          <div class="mt-4">
            <input
              type="text"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="League Name"
              bind:value={leagueName}
            />
            <input
              type="text"
              class="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Abbreviated Name"
              bind:value={abbreviatedName}
            />
            <input
              type="text"
              class="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Governing Body"
              bind:value={governingBody}
            />
            <div class="mt-4">
              <label for="gender">Gender</label>
              <select bind:value={gender} class="brand-dropdown">
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
            <div class="mt-4">
              <label for="date-formed">Team Count</label>
              <input
                type="number"
                class="brand-dropdown"
                bind:value={teamCount}
              />
            </div>
            <div class="mt-4">
              <label for="date-formed">Date Formed</label>
              <input
                type="date"
                class="brand-dropdown"
                bind:value={dateFormed}
              />
            </div>
            <div class="mt-4">
              <label for="country">Country</label>
              <select
                  class="p-2 brand-dropdown min-w-[100px] mb-2"
                  bind:value={countryId}
              >
                  <option value={0}>Select League Country</option>
                  {#each countries as country}
                  <option value={country.id}>{country.name}</option>
                  {/each}
              </select>
            </div>
            <div class="mt-4">
              <label for="logo">Logo</label>
              <button class="btn-file-upload brand-button" on:click={clickFileInput}>
                Upload Logo
              </button>
              <input
                type="file"
                id="logo-image"
                accept="image/*"
                bind:this={fileInput}
                on:change={handleFileChange}
                style="opacity: 0; position: absolute; left: 0; top: 0;"
              />
            </div>
          </div>
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
    </div>

    {#if isLoading}
      <LocalSpinner />
    {/if}
  </div>
</Modal>
