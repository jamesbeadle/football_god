<script lang="ts">
  import { onMount } from "svelte";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, FixtureDTO, GameweekNumber, RescheduleFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import { governanceStore } from "$lib/stores/governance-store";
  import { clubStore } from "$lib/stores/club-store";
    import { leagueStore } from "$lib/stores/league-store";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number;
  export let selectedSeasonId: number;
  export let selectedFixture: FixtureDTO;

  let gameweeks: GameweekNumber[] = [];
  let nextUnplayedGameweek: number = 0;
  let totalGameweeks: number = 0;
  let newGameweek: number = 0;
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
      nextUnplayedGameweek = leagueStatus.unplayedGameweek;
      gameweeks = Array.from(
        { length: totalGameweeks - nextUnplayedGameweek + 1 },
        (_, i) => nextUnplayedGameweek + i
      );


    } catch (error) {
      console.error("Error fetching postponed fixtures:", error);
    } finally {
      isLoading = false;
    }
  });

  let isLoading = true;
  let showConfirm = false;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: RescheduleFixtureDTO = {
      leagueId: selectedLeagueId,
      seasonId: selectedSeasonId,
      fixtureId: selectedFixture.id,
      updatedFixtureGameweek: newGameweek ?? 1,
      updatedFixtureDate: convertDateInputToUnixNano(dateTime)
    };
    let result = await governanceStore.rescheduleFixture(dto);
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
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
      <h3 class="default-header">Reschedule Fixture</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2 flex space-y-2">

          <p class="">Reschedule {homeTeam.friendlyName} v {awayTeam.friendlyName}</p>
        
          <p>Please select the league they are being loaned to:</p>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">New Fixture Date:</p>
            <input class="w-1/2 brand-input" type="date" bind:value={date} />
          </div>

          <div class="flex flex-row w-full items-center">
            <p class="w-1/2">New Fixture Time:</p>
            <input class="w-1/2 brand-input" type="time" bind:value={date} />
          </div>

          <select class="brand-dropdown w-full" bind:value={newGameweek}>
            <option value={0}>Select New Gameweek</option>
            {#each gameweeks as gameweek}
              <option value={gameweek}>Gameweek {gameweek}</option>
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