<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { toasts } from "$lib/stores/toasts-store";
  import type { Country } from "../../../../../../../declarations/backend/backend.did";
  import type { CreateLeague, Gender } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
  }

  let { visible, closeModal }: Props = $props();
  
  let leagueName = $state("");
  let abbreviatedName = $state("");
  let governingBody = $state("");
  let selectedGender = $state(0);
  let dateFormed = $state("");
  let countryId = $state(0);
  let logo: Uint8Array | number[] = $state([]);
  let fileInput: HTMLInputElement;
  let teamCount = $state(0);
  let countries: Country[] = $state([]);
  let isLoading = $state(true);

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
    selectedGender < 1 ||
    selectedGender > 2 ||
    countryId <= 0;
  });

  onMount(async () => {
    try { 
      let countriesResult = await countryStore.getCountries();
      if(!countriesResult) throw new Error("Failed to fetch countries");
      countries = countriesResult.countries;
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

  async function confirmProposal() {
    isLoading = true;
    
    var leagueGender: Gender = { "Male" : null };
    if(selectedGender == 2){
      leagueGender = { "Female" : null };
    }
    
    const dto: CreateLeague = {
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
    toasts.addToast({
      message: "League created successfully",
      type: "success",
      duration: 3000,
    });
    resetForm();
    closeModal();
  }

  function clickFileInput(event: Event) {
    event.preventDefault();
    fileInput.click();
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
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={"Create League"} {visible} onClose={closeModal}>
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
    
    <FormComponent label="Gender">
      <select class="brand-dropdown" bind:value={selectedGender}>
        {#each genderOptions as gender}
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

    <FormComponent label="Country">
      <select class="brand-dropdown" bind:value={countryId}>
        {#each countryOptions as country}
          <option value={country.id}>{country.label}</option>
        {/each}
      </select>
    </FormComponent>

    <FormComponent label="Logo:">
      <button class="btn-file-upload brand-button" onclick={clickFileInput}>
        Upload Logo
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
