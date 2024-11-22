<script lang="ts">
  import { onMount } from "svelte";

  import { clubStore } from "$lib/stores/club-store";
  import { userStore } from "$lib/stores/user-store";
  import { leagueStore } from "$lib/stores/league-store";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import type { ClubDTO, FixtureDTO, FootballLeagueDTO } from "../../../../../../declarations/backend/backend.did";
  import { adminStore } from "$lib/stores/admin-store";
  import MoveFixture from "../fixture/move-fixture.svelte";
    import { formatUnixTimeToTime } from "$lib/utils/helpers";
    import { goto } from "$app/navigation";

  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let fixtures: FixtureDTO[] = [];
  let isDataManager = false;
  let selectedFixtureId: number = 0;

  let showMoveFixtureModal = false;
  let showPostponeFixtureModal = false;
  let dropdownVisible: number | null = null;

  onMount(async () => {
    try {
      isDataManager = await userStore.isDataManager();
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);

      if (leagueId === 1) {
        const openFPLState = await adminStore.getSystemState("OpenFPL");
        if (!openFPLState) return;
        const openfpl_fixtures = await adminStore.getFixtures({
          seasonId: openFPLState?.pickTeamSeasonId,
          leagueId
        });
        if (!openfpl_fixtures) return;
        fixtures = openfpl_fixtures;
      } else if (leagueId === 2) {
        const openWSLState = await adminStore.getSystemState("OpenWSL");
        if (!openWSLState) return;
        const openwsl_fixtures = await adminStore.getFixtures({
          seasonId: openWSLState?.pickTeamSeasonId,
          leagueId
        });
        if (!openwsl_fixtures) return;
        fixtures = openwsl_fixtures;
      }
    } catch (error) {
      console.error("Error fetching league fixtures:", error);
    }
  });

  function toggleDropdown(fixtureId: number, event: MouseEvent) {
    event.stopPropagation();
    dropdownVisible = dropdownVisible === fixtureId ? null : fixtureId;
  }

  function loadMoveFixture(fixtureId: number) {
    selectedFixtureId = fixtureId;
    showMoveFixtureModal = true;
  }

  function loadPostponeFixture(fixtureId: number) {
    selectedFixtureId = fixtureId;
    showPostponeFixtureModal = true;
  }

  async function loadAddFixtureData(fixtureId: number) {
    var systemState = await adminStore.getSystemState("OpenFPL");
    if(!systemState){
      return;
    }
    goto(`/add-fixture-data?id=${fixtureId}&league-id=${leagueId}&season-id=${systemState.calculationSeasonId}`);
  }

  function closeModal() {
    selectedFixtureId = 0;
    showMoveFixtureModal = false;
    showPostponeFixtureModal = false;
  }
</script>

<div class="page-header-wrapper flex w-full">
  <div class="content-panel w-full flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
    <div class="flex justify-between items-center w-full mb-6">
      {#if league}
        <h1 class="text-2xl font-bold text-white">{league.name} Fixtures</h1>
      {/if}
    </div>

    <div>
      {#if fixtures}
        {#each fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff)) as fixture}
          {@const homeClub = clubs.find(x => x.id == fixture.homeClubId)}
          {@const awayClub = clubs.find(x => x.id == fixture.awayClubId)}

          <div class="bg-gray-700 hover:bg-gray-600 transition-all rounded-lg shadow p-4 w-full my-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <BadgeIcon
                  primaryColour={homeClub?.primaryColourHex}
                  secondaryColour={homeClub?.secondaryColourHex}
                  thirdColour={homeClub?.thirdColourHex}
                  className="w-8"
                />
                <span class="text-white">{homeClub?.friendlyName}</span>
              </div>

              <div class="text-white font-bold text-lg">vs</div>

              <div class="flex items-center space-x-2">
                <BadgeIcon
                  primaryColour={awayClub?.primaryColourHex}
                  secondaryColour={awayClub?.secondaryColourHex}
                  thirdColour={awayClub?.thirdColourHex}
                  className="w-8"
                />
                <span class="text-white">{awayClub?.friendlyName}</span>
              </div>

              <div class="relative">
                <button class="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md" on:click={(event) => toggleDropdown(fixture.id, event)}>
                  Actions
                </button>
                {#if dropdownVisible === fixture.id}
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadAddFixtureData(fixture.id)}>Add Fixture Data</button>
                    <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadMoveFixture(fixture.id)}>Move Fixture</button>
                    <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadPostponeFixture(fixture.id)}>Postpone Fixture</button>
                  </div>
                {/if}
              </div>
            </div>
            <div class="flex">
              <p>Fixture ID: {fixture.id}</p>
            </div>
            <div class="flex">
              <p>Kick Off: {formatUnixTimeToTime(Number(fixture.kickOff))}</p>
            </div>
            <div class="flex">
              <p>Gameweek: {fixture.gameweek}</p>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

{#if selectedFixtureId > 0 && showMoveFixtureModal}
  {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
  <MoveFixture visible={showMoveFixtureModal} {closeModal} {selectedFixtureId} selectedGameweek={selectedFixture?.gameweek} selectedLeagueId={leagueId}/>
{/if}
