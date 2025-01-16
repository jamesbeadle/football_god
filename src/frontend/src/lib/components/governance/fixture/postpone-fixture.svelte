<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  //import { governanceStore } from "$lib/stores/governance-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import { isError } from "$lib/utils/helpers";
  import type { ClubDTO, FixtureDTO } from "../../../../../../declarations/backend/backend.did";
    import Modal from "$lib/components/shared/modal.svelte";
    import type { PostponeFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
    import { leagueStore } from "$lib/stores/league-store";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedFixtureId: number;
  export let selectedLeagueId: number;
  export let selectedGameweek: number;

  let gameweeks = Array.from({ length: Number(process.env.TOTAL_GAMEWEEKS) }, (_, i) => i + 1);
  let gameweekFixtures: FixtureDTO[] = [];
  let clubs: ClubDTO[] = [];

  $: isSubmitDisabled = !selectedFixtureId || selectedFixtureId <= 0;

  $: if (selectedGameweek) {
    loadGameweekFixtures();
  }

  async function loadGameweekFixtures() {
    let leagueFixtures = await fixtureStore.getFixtures(selectedLeagueId);
    gameweekFixtures = leagueFixtures.filter(
      (x) => x.gameweek == selectedGameweek
    );
  }

  let isLoading = true;
  let showConfirm = false;

  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      gameweeks = Array.from({ length: leagueStatus.totalGameweeks }, (_, i) => i + 1);
      if(selectedLeagueId > 0){
          clubs = await clubStore.getClubs(selectedLeagueId);
      }
      await loadGameweekFixtures();
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  function getTeamById(teamId: number): ClubDTO {
    return clubs.find((x) => x.id === teamId)!;
  }

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

    let dto: PostponeFixtureDTO = {
      leagueId: selectedLeagueId,
      seasonId: leagueStatus.activeSeasonId,
      fixtureId : selectedFixtureId
    };
    await fixtureStore.postponeFixture(dto);
    
    /*
    let result = await governanceStore.postponeFixture(selectedFixtureId);
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
      <h3 class="default-header">Postpone Fixture</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    {#if isLoading}
      <LocalSpinner />
    {:else}
    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
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
              {@const homeTeam = getTeamById(fixture.homeClubId)}
              {@const awayTeam = getTeamById(fixture.awayClubId)}
              <option value={fixture.id}
                >{homeTeam.friendlyName} v {awayTeam.friendlyName}</option
              >
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
      </div>
    </div>

    {/if}
  </div>
</Modal>