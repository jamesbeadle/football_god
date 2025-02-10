<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateTimeInputToUnixNano, isError } from "$lib/utils/helpers";
  import type { ClubDTO, FixtureDTO, MoveFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedLeagueId = 0;
  export let selectedGameweek = 0;
  export let selectedFixtureId = 0;

  let clubs: ClubDTO[] = [];
  let gameweeks: number[] = [];
  let gameweekFixtures: FixtureDTO[] = [];
  let newGameweek = 0;
  let date = "";
  let time = "";
  let dateTime = "";

  $: dateTime = date + "T" + time;

  $: isSubmitDisabled =
    !selectedFixtureId ||
    selectedFixtureId <= 0 ||
    newGameweek <= 0 ||
    date == "" ||
    time == "";

  $: if (selectedLeagueId && selectedLeagueId > 0 && selectedGameweek && selectedGameweek > 0) {
    loadGameweekFixtures();
  }

  async function loadGameweekFixtures() {

    let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
   
    var fixtures = await fixtureStore.getFixtures(selectedLeagueId, leagueStatus.activeSeasonId);

    if(!fixtures){
      return;
    }

    gameweekFixtures = fixtures.filter(x => x.gameweek == selectedGameweek);

  }

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  onMount(async () => {
    try {
      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      gameweeks = Array.from({ length: leagueStatus.totalGameweeks }, (_, i) => i + 1);
     if(selectedLeagueId > 0){
        clubs = await clubStore.getClubs(selectedLeagueId);
      }
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
        updatedFixtureGameweek : newGameweek,
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
    newGameweek = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Move Fixture"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>

    <FormComponent label="Select Fixture:">
      <select
          class="brand-dropdown"
          bind:value={selectedFixtureId}
        >
          <option value={0}>Select Fixture</option>
          {#each gameweekFixtures as fixture}
            {@const homeTeam = clubs.find(x => x.id == fixture.homeClubId)}
            {@const awayTeam = clubs.find(x => x.id == fixture.awayClubId)}
            <option value={fixture.id}
              >{homeTeam?.friendlyName} v {awayTeam?.friendlyName}</option
            >
          {/each}
        </select>
    </FormComponent>

    <FormComponent label="Set new date:">
      <input type="date" bind:value={date} class="brand-input" />
    </FormComponent>

    <FormComponent label="Select Time:">
      <input type="time" bind:value={time} class="brand-input" />
    </FormComponent>

    <FormComponent label="Select Gameweek:">
      <select
        class="brand-dropdown"
        bind:value={newGameweek}
      >
        <option value={0}>Select New Gameweek</option>
        {#each gameweeks as gameweek}
          <option value={gameweek}>Gameweek {gameweek}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>