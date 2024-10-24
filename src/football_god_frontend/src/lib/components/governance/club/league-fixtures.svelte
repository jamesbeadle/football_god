<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { toastsError } from "$lib/stores/toasts-store";
  import { clubStore } from "$lib/stores/club-store";
  import { userStore } from "$lib/stores/user-store";
  import { leagueStore } from "$lib/stores/league-store";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import type { ClubDTO, FixtureDTO, FootballLeagueDTO } from "../../../../../../declarations/football_god_backend/football_god_backend.did";
  import { adminStore } from "$lib/stores/admin-store";
    import MoveFixture from "../fixture/move-fixture.svelte";

  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let fixtures: FixtureDTO[] = [];
  let isAdmin = false;
  let selectedFixtureId: number = 0;

  let showMoveFixtureModal = false;
  let showPostponeFixtureModal = false;
  let dropdownVisible: number | null = null;

  onMount(async () => {
    try {
      isAdmin = await userStore.isAdmin();
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);

      switch(leagueId){
        case 1:
          let openFPLState = await adminStore.getSystemState("OpenFPL");
          if(!openFPLState){
            return;
          }

          let openfpl_fixtures = await adminStore.getFixtures({
            seasonId: openFPLState?.pickTeamSeasonId,
            leagueId
          });

          if(!openfpl_fixtures){
            return;
          }

          fixtures = openfpl_fixtures;
          
          break;
        case 2:
          let openWSLState = await adminStore.getSystemState("OpenWSL");
          if(!openWSLState){
            return;
          }

          let openwsl_fixtures = await adminStore.getFixtures({
            seasonId: openWSLState?.pickTeamSeasonId,
            leagueId
          });

          if(!openwsl_fixtures){
            return;
          }

          fixtures = openwsl_fixtures;
          break;
        default:
          break;
      }
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching league fixtures." },
        err: error,
      });
      console.error("Error fetching league fixtures:", error);
    } finally {
    }
  });

  onMount(() => {
      document.addEventListener('click', handleClickOutside);

      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  function toggleDropdown(fixtureId: number, event: MouseEvent) {
      event.stopPropagation();
      dropdownVisible = dropdownVisible === fixtureId ? null : fixtureId;
  }

  function loadMoveFixture(fixtureId: number){
      selectedFixtureId = fixtureId;
      showMoveFixtureModal = true;
  }

  function loadPostponeFixture(fixtureId: number){
      selectedFixtureId = fixtureId;
      showPostponeFixtureModal = true;
  }

  function closeModal(){
      selectedFixtureId = 0;
      showMoveFixtureModal = false;
      showPostponeFixtureModal = false;
  }

  function handleClickOutside(event: MouseEvent) {
      const dropdownElements = document.querySelectorAll('.dropdown-menu');
      const targetElement = event.target as HTMLElement;

      if (![...dropdownElements].some(dropdown => dropdown.contains(targetElement))) {
          dropdownVisible = null;
      }
  }


</script>

<div class="page-header-wrapper flex w-full">
  <div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
    <div class="flex justify-between items-center w-full mb-4">
      {#if league}
        <p class="text-2xl font-bold text-white">{league.name} Fixtures</p>
      {/if}
    </div>

    <div>
      {#if fixtures}
        {#each fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff)) as fixture}
          {@const homeClub = clubs.find(x => x.id == fixture.homeClubId)}
          {@const awayClub = clubs.find(x => x.id == fixture.awayClubId)}
          <div class="flex flex-row items-center bg-gray-700 rounded shadow p-4 w-full my-2">
            <div class="col-1 flex flex-col items-center">
              <BadgeIcon
                primaryColour={homeClub?.primaryColourHex}
                secondaryColour={homeClub?.secondaryColourHex}
                thirdColour={homeClub?.thirdColourHex}
                className="w-8"
              />
              <p>{homeClub?.friendlyName}</p>
            </div>
            <div class="col-1 flex flex-col items-center">
              <p class="text-center">v</p>
            </div>
            <div class="col-1 flex flex-col items-center">
              <BadgeIcon
                primaryColour={awayClub?.primaryColourHex}
                secondaryColour={awayClub?.secondaryColourHex}
                thirdColour={awayClub?.thirdColourHex}
                className="w-8"
              />
              <p>{awayClub?.friendlyName}</p>
            </div>
          </div>
          <div class="relative">
            <button class="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg" on:click={(event) => toggleDropdown(fixture.id, event)}>Actions</button>
            {#if dropdownVisible === fixture.id}
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 text-sm dropdown-menu">
                <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadMoveFixture(fixture.id)}>Move Fixture</button>
                <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadPostponeFixture(fixture.id)}>Postpone Fixture</button>
              </div>
            {/if}
        </div>
        {/each}

      {/if}
    </div>
  </div>
</div>

{#if selectedFixtureId > 0 && showMoveFixtureModal}
  {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId) }
  <MoveFixture visible={showMoveFixtureModal} {closeModal} {selectedFixtureId} selectedGameweek={selectedFixture?.gameweek} selectedLeagueId={leagueId}/>
{/if}
