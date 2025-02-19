<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, FixtureDTO, GameweekNumber, RescheduleFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import { governanceStore } from "$lib/stores/governance-store";
  import { clubStore } from "$lib/stores/club-store";
  import { leagueStore } from "$lib/stores/league-store";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import DropdownSelect from "$lib/components/shared/dropdown-select.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number;
  export let selectedSeasonId: number;
  export let selectedFixture: FixtureDTO;

  let gameweeks: GameweekNumber[] = [];
  let nextUnplayedGameweek: number = 0;
  let totalGameweeks: number = 0;
  let newGameweek: number = 0;
  let gameweekOptions: { id: number; label: string }[] = [];
  let clubs: ClubDTO[] = [];
  let homeTeam: ClubDTO;
  let awayTeam: ClubDTO;
  
  let date = "";
  let time = "";
  let dateTime = "";

  $: dateTime = date + "T" + time;

  $: isSubmitDisabled =
    newGameweek <= 0 ||
    date == "" ||
    time == "";

  onMount(async () => {
    try {
      clubs = await clubStore.getClubs(selectedLeagueId);
      homeTeam = clubs.find(x=>x.id == selectedFixture.homeClubId)!;
      awayTeam = clubs.find(x=>x.id == selectedFixture.awayClubId)!;

      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      totalGameweeks = leagueStatus.totalGameweeks;
      gameweeks = Array.from(
        { length: totalGameweeks },
        (_, i) => 1 + i
      );

      gameweekOptions = [
        { id: 0, label: "Select Gameweek" },
        ...gameweeks.map(week => ({
          id: week,
          label: `Gameweek: ${week}`
        }))
      ];


    } catch (error) {
      console.error("Error fetching postponed fixtures:", error);
    } finally {
      isLoading = false;
    }
  });

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  function handleGameweekChange(value: string | number) {
    newGameweek = Number(value);
  }

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      let dto: RescheduleFixtureDTO = {
        leagueId: selectedLeagueId,
        seasonId: selectedSeasonId,
        fixtureId: selectedFixture.id,
        updatedFixtureGameweek: newGameweek ?? 1,
        updatedFixtureDate: convertDateInputToUnixNano(dateTime)
      };
      submitting = true;

      let result = await governanceStore.rescheduleFixture(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }

      submitted = true;
      submitting = false;

      //clear local storage


    } catch (error) {
      console.error("Error raising proposal: ", error);
    } finally {
      isLoading = false;
      visible = false;
      resetForm();
      closeModal();
    }

    isLoading = false;
    resetForm();
    cancelModal();
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
  <GovernanceModal title={"Reschedule Fixture"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    
    <p class="">Reschedule {homeTeam.friendlyName} v {awayTeam.friendlyName}</p>
    
    <FormComponent label="New Fixture Date:">
      <input class="brand-input" type="date" bind:value={date} />
    </FormComponent>

    <FormComponent label="New Fixture Time:">
      <input class="brand-input" type="time" bind:value={time} />
    </FormComponent>
    
    <FormComponent label="Select New Gameweek:">
      <DropdownSelect 
        value={newGameweek}
        options={gameweekOptions}
        onChange={handleGameweekChange}
        placeholder="Select Gameweek"
        compact={true}
      />
    </FormComponent>
  </GovernanceModal>
</Modal>