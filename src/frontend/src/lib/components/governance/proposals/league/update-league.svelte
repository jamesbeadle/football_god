<script lang="ts">
  import { countryStore } from "$lib/stores/country-store";
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import {getImageURL } from "$lib/utils/helpers";
  import type { Country, Gender, League } from "../../../../../../../declarations/backend/backend.did";
  import type { UpdateLeague } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/global/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

    interface Props {
      visible: boolean;
      closeModal: () => void;
      selectedLeague: League;
    }

    let { visible, closeModal, selectedLeague }: Props = $props();
    
  let leagueName = $state("");
  let abbreviatedName = $state("");
  let governingBody = $state("");
  let selectedGender = $state(1);
  let dateFormed = $state("");
  let countryId = $state(0);
  let logo: Uint8Array | number[] = $state([]);
  let fileInput: HTMLInputElement;
  let teamCount = $state(0);
  let countries: Country[] = $state([]);

  let isLoading = $state(true);
  let isSubmitDisabled = $state(true);

  $effect(() => {
    isSubmitDisabled =
    leagueName.length <= 0 ||
    leagueName.length > 100 ||
    abbreviatedName.length <= 0 ||
    abbreviatedName.length > 50 ||
    governingBody.length <= 0 ||
    governingBody.length > 50 ||
    dateFormed.length <= 0 ||
    dateFormed.length > 50 ||
    countryId <= 0;
  });

  onMount(async () => {
    try {
      leagueName = selectedLeague.name;
      abbreviatedName = selectedLeague.abbreviation;
      governingBody = selectedLeague.governingBody;
      selectedGender = "Male" in selectedLeague.relatedGender ? 1 : 2;
      const date = new Date(Number(selectedLeague.formed) / 1_000_000);
      dateFormed = date.toISOString().split('T')[0];
      countryId = selectedLeague.countryId;
      logo = selectedLeague.logo;
      teamCount = selectedLeague.teamCount;
      let countriesResult = await countryStore.getCountries();
      if(!countriesResult) throw new Error("Failed to fetch countries");
      countries = countriesResult.countries;
      countryOptions = countries.map(country => ({
        id: country.id,
        label: country.name
      }));
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  const genderOptions = [
    { id: 0, label: "Select a Gender" },
    { id: 1, label: "Male" },
    { id: 2, label: "Female" }
  ];
  
  let countryOptions = $derived(countries.map(country => ({
    id: country.id,
    label: country.name
  })));

  function handleGenderChange(value: string | number) {
    selectedGender = Number(value);
  }

  function handleCountryChange(value: string | number) {
    countryId = Number(value);
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

  async function convertFileToUint8Array(file: Blob): Promise<Uint8Array> {
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

  function getGenderFromValue(value: number): Gender {
    return value === 1 ? { "Male": null } : { "Female": null };
  }

  async function confirmProposal() {
    isLoading = true;
    const dto: UpdateLeague = {
        leagueId: selectedLeague.id,
        name: leagueName,
        abbreviation: abbreviatedName,
        governingBody,
        relatedGender: getGenderFromValue(selectedGender),
        formed: BigInt(new Date(dateFormed).getTime() * 1_000_000),
        countryId,
        logo: Array.isArray(logo) ? logo : Array.from(logo),
        teamCount: teamCount
    };

      await governanceStore.updateLeague(dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    leagueName = "";
    abbreviatedName = "";
    governingBody = "";
    selectedGender = 1;
    dateFormed = "";
    countryId = 0;
    logo = [];
    countries = [];
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={"Update League"} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    
    <FormComponent label="League Name:">
      <input
        type="text"
        class="modal-input-box"
        bind:value={leagueName}
      />
    </FormComponent>

    <FormComponent label="Abbreviated Name:">
      <input
        type="text"
        class="modal-input-box"
        bind:value={abbreviatedName}
      />
    </FormComponent>

    <FormComponent label="Governing Body:">
      <input
        type="text"
        class="modal-input-box"
        bind:value={governingBody}
      />
    </FormComponent>
    <FormComponent label="League Gender:">
      <select bind:value={selectedGender} class="w-full brand-input">
        <option value={null}>Select Gender</option>
        {#each genderOptions.sort((a, b) => Number(a.id) - Number(b.id)) as gender }
          <option value={gender.id}>{gender.label}</option>
        {/each}
      </select>
    </FormComponent>
    
    <FormComponent label="Team Count:">
      <input
        type="number"
        class="modal-input-box"
        bind:value={teamCount}
      />
    </FormComponent>

    <FormComponent label="Date Formed:">
      <input
        type="date"
        class="modal-input-box"
        bind:value={dateFormed}
      />
    </FormComponent>

    <FormComponent label="Country:">
      <select bind:value={countryId} class="w-full brand-input">
        <option value={null}>Select Gameweek</option>
        {#each countryOptions.sort((a, b) => Number(a.id) - Number(b.id)) as country }
          <option value={country.id}>{country.label}</option>
        {/each}
      </select>
    </FormComponent>

    <FormComponent label="Logo:">
      {#if logo && Object.keys(logo).length > 0}
        <div class="mb-2">
          <img 
            src={getImageURL(logo)} 
            alt="Current logo" 
            class="object-contain w-16 h-16 my-4"
          />
        </div>
      {/if}
      <button class="btn-file-upload brand-button" onclick={clickFileInput}>
        Change Logo
      </button>
      <input
        type="file"
        id="logo-image"
        accept="image/*"
        bind:this={fileInput}
        onchange={handleFileChange}
        style="opacity: 0; position: absolute; left: 0; top: 0;"
      />
    </FormComponent> 
  </GovernanceModal>
</Modal>
