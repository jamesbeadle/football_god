<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateTimeInputToUnixNano, isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
    import type { Club } from "../../../../../../../declarations/backend/backend.did";
    import type { MoveFixture } from "../../../../../../../declarations/data_canister/data_canister.did";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId: number;
  export let selectedGameweek: number;
  export let selectedFixtureId: number;
  export let homeClub: Club;
  export let awayClub: Club;

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
      let leagueStatusResult = await leagueStore.getLeagueStatus(selectedLeagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;
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

      let leagueStatusResult = await leagueStore.getLeagueStatus(selectedLeagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;
      if(!leagueStatus){
        return
      }

      let dto: MoveFixture = {
        leagueId: selectedLeagueId,
        seasonId: leagueStatus.activeSeasonId,
        fixtureId : selectedFixtureId,
        updatedFixtureGameweek : selectedGameweek,
        updatedFixtureDate: convertDateTimeInputToUnixNano(dateTime)
      };
      submitting = true;

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
      isLoading = false;
      visible = false;
      resetForm();
      closeModal();
    }
  }

  function resetForm() {
    date = "";
    time = "";
    dateTime = "";
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={`Move Fixture: ${homeClub.friendlyName} v ${awayClub.friendlyName}`} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
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