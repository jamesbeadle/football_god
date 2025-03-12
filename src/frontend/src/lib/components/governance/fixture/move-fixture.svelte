<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateTimeInputToUnixNano, isError } from "$lib/utils/helpers";
  import type { ClubDTO, MoveFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId: number;
  export let selectedGameweek: number;
  export let selectedFixtureId: number;
  export let homeClub: ClubDTO;
  export let awayClub: ClubDTO;

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  let gameweeks: number[] = [];
  let date = "";
  let time = "";
  let dateTime = "";

  $: dateTime = date + "T" + time;

  $: isSubmitDisabled =
    !selectedFixtureId ||
    selectedFixtureId <= 0 ||
    selectedGameweek <= 0 ||
    date == "" ||
    time == "";


  onMount(async () => {
    try {
      console.log(selectedFixtureId)
      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      gameweeks = Array.from({ length: leagueStatus.totalGameweeks }, (_, i) => i + 1);
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

      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      if(!leagueStatus){
        return
      }

      let dto: MoveFixtureDTO = {
        leagueId: selectedLeagueId,
        seasonId: leagueStatus.activeSeasonId,
        fixtureId : selectedFixtureId,
        updatedFixtureGameweek : selectedGameweek,
        updatedFixtureDate: convertDateTimeInputToUnixNano(dateTime)
      };
      submitting = true;

      console.log("moving fixture")
      let result = await governanceStore.moveFixture(dto);
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
      console.log("finally")
      isLoading = false;
      visible = false;
      resetForm();
      closeModal();
    }
  }

  function resetForm() {
    console.log("resetting")
    date = "";
    time = "";
    dateTime = "";
  }

  function cancelModal() {
    console.log("cancelling")
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={`Move Fixture: ${homeClub.friendlyName} v ${awayClub.friendlyName}`} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Set new date:">
      <input type="date" bind:value={date} class="brand-input" />
    </FormComponent>

    <FormComponent label="Select Time:">
      <input type="time" bind:value={time} class="brand-input" />
    </FormComponent>

    <FormComponent label="Select Gameweek:">
      <select
        class="brand-dropdown"
        bind:value={selectedGameweek}
      >
        {#each gameweeks as gameweek}
          <option value={gameweek}>Gameweek {gameweek}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>