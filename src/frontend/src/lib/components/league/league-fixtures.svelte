<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { formatUnixTimeToTime } from "$lib/utils/helpers";
  import MoveFixture from "../governance/fixture/move-fixture.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
    import PipsIcon from "$lib/icons/pips-icon.svelte";
    import PostponeFixture from "../governance/fixture/postpone-fixture.svelte";
    import type { ClubDTO, FixtureDTO, FootballLeagueDTO } from "../../../../../declarations/data_canister/data_canister.did";
  
  let isLoading = true;


  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let fixtures: FixtureDTO[] = [];
  let fitleredFixtures: FixtureDTO[] = [];
  let selectedGameweek: number = 1;
  let selectedFixtureId: number = 0;

  let showMoveFixtureModal = false;
  let showPostponeFixtureModal = false;
  let dropdownVisible: number | null = null;
  let gameweeks: number[] = [];
  
  onMount(async () => {
    try {
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
      fixtures = await fixtureStore.getFixtures(leagueId);

      const highestGameweek = fixtures.reduce((max, fixture) => Math.max(max, fixture.gameweek), 0);
      gameweeks = Array.from({ length: Number(highestGameweek) }, (_, i) => i + 1);

      selectedGameweek = fixtures.find(fixture => Object.keys(fixture.status)[0] === 'Unplayed')?.gameweek ?? 1;
      filterFixtures();
    } catch (error) {
      console.error("Error fetching league fixtures:", error);
    } finally {
      isLoading = false;
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

  function handleClickOutside(event: MouseEvent) {
      const dropdownElements = document.querySelectorAll('.dropdown-menu');
      const targetElement = event.target as HTMLElement;

      if (![...dropdownElements].some(dropdown => dropdown.contains(targetElement))) {
          dropdownVisible = null;
      }
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
    var leagueStatus = await leagueStore.getLeagueStatus(leagueId);
    if(!leagueStatus){
      return;
    }
    goto(`/add-fixture-data?id=${fixtureId}&league-id=${leagueId}&season-id=${leagueStatus.activeSeasonId}`);
  }

  function closeModal() {
    selectedFixtureId = 0;
    showMoveFixtureModal = false;
    showPostponeFixtureModal = false;
  }

  $: if(selectedGameweek > 0){
    filterFixtures();
  }

  function filterFixtures(){
    fitleredFixtures = fixtures.filter(x => x.gameweek == selectedGameweek);
  }
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  
  <div class="flex w-full">
    <div class="w-full flex flex-col rounded-lg shadow-lg">
      
      {#if league}
      
        <div class="flex justify-between items-center w-full mb-4">
            <h1>{league.name} Fixtures</h1>
        </div>

        <div class="flex flex-col md:flex-row my-2 items-center">
          <p>Select a gameweek:</p>
          <select
            class="p-1 brand-dropdown w-full md:w-auto mx-auto md:ml-2"
            bind:value={selectedGameweek}
          >
            <option value={0}>Select Gameweek</option>
            {#each gameweeks as gameweek}
              <option value={gameweek}>Gameweek: {gameweek}</option>
            {/each}
          </select>
        </div>

        


      
        
      <div class="space-y-4">
        {#if fixtures}
            {#each fitleredFixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff)) as fixture}
              {@const homeClub = clubs.find(x => x.id == fixture.homeClubId)}
              {@const awayClub = clubs.find(x => x.id == fixture.awayClubId)}
              <div class="bg-BrandDarkGray p-4 rounded shadow-md flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:justify-between">
                <div class="flex items-center space-x-4">
                  <BadgeIcon primaryColour={homeClub?.primaryColourHex} secondaryColour={homeClub?.secondaryColourHex} className="w-6 h-6" />
                  <span class="text-white text-sm">{homeClub?.friendlyName}</span>
                  <span class="text-white font-semibold text-xs">vs</span>
                  <BadgeIcon primaryColour={awayClub?.primaryColourHex} secondaryColour={awayClub?.secondaryColourHex} className="w-6 h-6" />
                  <span class="text-white text-sm">{awayClub?.friendlyName}</span>
                </div>
                <div class="text-BrandLightGray text-xs text-right md:text-left">{formatUnixTimeToTime(Number(fixture.kickOff))}</div>
                <div class="flex items-center space-x-2">
                  <button
                    class="p-2"
                    on:click={(event) => toggleDropdown(fixture.id, event)}
                  >
                    <PipsIcon className="w-6" />
                  </button>
                  {#if dropdownVisible === fixture.id}
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <button class="dropdown-link" on:click={() => loadAddFixtureData(fixture.id)}>Add Fixture Data</button>
                      <button class="dropdown-link" on:click={() => loadMoveFixture(fixture.id)}>Move Fixture</button>
                      <button class="dropdown-link" on:click={() => loadPostponeFixture(fixture.id)}>Postpone Fixture</button>
                    </div>
                  {/if}
                </div>
              </div>
        
            {/each}
          {/if}
        </div>


      {/if}
    </div>
  </div>

  {#if selectedFixtureId > 0 && showMoveFixtureModal}
    {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
    <MoveFixture visible={showMoveFixtureModal} {closeModal} {selectedFixtureId} selectedGameweek={selectedFixture?.gameweek} selectedLeagueId={leagueId}/>
  {/if}

  {#if selectedFixtureId > 0 && showPostponeFixtureModal}
    {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
    <PostponeFixture visible={showPostponeFixtureModal} {closeModal} {selectedFixtureId} selectedGameweek={selectedFixture?.gameweek!} selectedLeagueId={leagueId}/>
  {/if}

{/if}
