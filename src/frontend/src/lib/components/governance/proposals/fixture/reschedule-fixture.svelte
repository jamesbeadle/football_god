<script lang="ts">
  import { onMount } from "svelte";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import { governanceStore } from "$lib/stores/governance-store";
  import { clubStore } from "$lib/stores/club-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { Club, Fixture, GameweekNumber } from "../../../../../../../declarations/backend/backend.did";
  import type { RescheduleFixture } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedLeagueId: number;
    selectedFixture: Fixture;
    selectedSeasonId: number;
  }

  let { visible, closeModal, selectedLeagueId, selectedSeasonId, selectedFixture }: Props = $props();

  let gameweeks: GameweekNumber[] = [];
  let totalGameweeks: number = 0;
  let newGameweek: number = $state(0);
  let gameweekOptions: { id: number; label: string }[] = $state([]);
  let clubs: Club[] = $state([]);
  let homeTeam: Club | undefined = $state(undefined);
  let awayTeam: Club | undefined = $state(undefined);
  
  let date = $state("");
  let time = $state("");
  let dateTime = $state("");

  $effect(() => { dateTime = date + "T" + time; });
  $effect(() => { isSubmitDisabled = newGameweek <= 0 || date == "" || time == ""; });

  onMount(async () => {
    try {
      let clubsResult = await clubStore.getClubs(selectedLeagueId);
      if(!clubsResult) throw new Error("Error loading clubs")
      clubs = clubsResult.clubs;

      homeTeam = clubs.find(x=>x.id == selectedFixture.homeClubId)!;
      awayTeam = clubs.find(x=>x.id == selectedFixture.awayClubId)!;

      let leagueStatusResult = await leagueStore.getLeagueStatus(selectedLeagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;
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

  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(true);

  function handleGameweekChange(value: string | number) {
    newGameweek = Number(value);
  }

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      let dto: RescheduleFixture = {
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

<Modal title={"Reschedule Fixture"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    
    <p class="">Reschedule {homeTeam!.friendlyName} v {awayTeam!.friendlyName}</p>
    
    <FormComponent label="New Fixture Date:">
      <input class="brand-input" type="date" bind:value={date} />
    </FormComponent>

    <FormComponent label="New Fixture Time:">
      <input class="brand-input" type="time" bind:value={time} />
    </FormComponent>
    
    <FormComponent label="Select New Gameweek:">
      <select bind:value={newGameweek} class="w-full brand-input">
        <option value={null}>Select Gameweek</option>
        {#each gameweekOptions.sort((a, b) => Number(a.id) - Number(b.id)) as gameweek }
          <option value={gameweek.id}>{gameweek.label}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>