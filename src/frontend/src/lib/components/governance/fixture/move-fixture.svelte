<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  //import { governanceStore } from "$lib/stores/governance-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import { adminStore } from "$lib/stores/admin-store";
    import { leagueStore } from "$lib/stores/league-store";
    import { convertDateTimeInputToUnixNano } from "$lib/utils/helpers";
    import Modal from "$lib/components/shared/modal.svelte";
    import type { ClubDTO, FixtureDTO, FootballLeagueDTO, MoveFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";

  export let visible: boolean;
  export let closeModal: () => void;
  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  let gameweeks: number[] = [];
  let gameweekFixtures: FixtureDTO[] = [];

  export let selectedLeagueId = 0;
  export let selectedGameweek = 0;
  export let selectedFixtureId = 0;
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
   
    var fixtures = await fixtureStore.getFixtures(selectedLeagueId);

    if(!fixtures){
      return;
    }

    gameweekFixtures = fixtures.filter(x => x.gameweek == selectedGameweek);

  }

  let isLoading = true;
  let showConfirm = false;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      leagues = await leagueStore.getLeagues();
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

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;

    let applicationName = "";

    switch(selectedLeagueId){
      case 1:
        applicationName = "OpenFPL";
        break;
      case 2:
        applicationName = "OpenWSL";
        break;
      default: 
        return;
    }
    
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
    await fixtureStore.moveFixture(dto);
    /*
    let result = await governanceStore.moveFixture(
      selectedFixtureId,
      newGameweek ?? 1,
      dateTime
    );
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
      */
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
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Move Fixture</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">

      <div class="w-full flex-col space-y-4 mb-2">

        <p>Select the player's league:</p>

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
          
          <div class="flex-col space-y-2">
            <p>Select Gameweek:</p>
            <select
              class="p-2 brand-dropdown my-4 min-w-[100px]"
              bind:value={selectedGameweek}
            >
              <option value={0}>Select Gameweek</option>
              {#each gameweeks as gameweek}
                <option value={gameweek}>Gameweek {gameweek}</option>
              {/each}
            </select>
          </div>

          <div class="flex-col space-y-2">
            <p>Select Fixture:</p>
            <select
              class="p-2 brand-dropdown my-4 min-w-[100px]"
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
          </div>

          <div class="border-b border-gray-200 my-4" />
          <p class="mr-2 my-2">Set new date:</p>
          <div class="flex flex-row my-2">
            <p class="mr-2">Select Date:</p>
            <input type="date" bind:value={date} class="brand-dropdown" />
          </div>
          <div class="flex flex-row my-2">
            <p class="mr-2">Select Time:</p>
            <input type="time" bind:value={time} class="brand-dropdown" />
          </div>
          <div class="flex flex-row my-2 items-center">
            <p class="mr-2">Select Gameweek:</p>

            <select
              class="p-2 brand-dropdown my-4 min-w-[100px]"
              bind:value={newGameweek}
            >
              <option value={0}>Select New Gameweek</option>
              {#each gameweeks as gameweek}
                <option value={gameweek}>Gameweek {gameweek}</option>
              {/each}
            </select>
          </div>

          <div class="border-b border-gray-200" />

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


        {/if}
      </div>
    </div>

    {#if isLoading}
      <LocalSpinner />
    {/if}
  </div>
</Modal>