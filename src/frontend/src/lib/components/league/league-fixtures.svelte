<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import type { Club, Fixture, GameweekNumber, League, LeagueStatus } from "../../../../../declarations/backend/backend.did";
  
  import MoveFixture from "../governance/proposals/fixture/move-fixture.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PostponeFixture from "../governance/proposals/fixture/postpone-fixture.svelte";
  import FixtureDisplay from "./fixture-display.svelte";
  import FormComponent from "../shared/form-component.svelte";
  
  interface Props {
    league: League,
    leagueStatus: LeagueStatus;
    gameweeks: GameweekNumber[];
    clubs: Club[];
  }

  let { league, leagueStatus, gameweeks, clubs }: Props = $props();
  
  let isLoading = $state(true);
  let fixtures: Fixture[] = $state([]);
  let filteredFixtures: Fixture[] = $state([]);
  let selectedGameweek: number = $state(1);
  let selectedFixtureId: number = $state(0);
  let dropdownVisible: number | null = $state(null);
  let showMoveFixtureModal = $state(false);
  let showPostponeFixtureModal = $state(false);
  
  onMount(async () => {
    try {
      
      let fixturesResult = await fixtureStore.getFixtures(league.id, leagueStatus.activeSeasonId ?? 1);
      if(!fixturesResult) throw new Error("Failed to fetch fixtures");
      fixtures = fixturesResult.fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff));
      
      if (leagueStatus) {
        if(leagueStatus.activeGameweek > 0){
          selectedGameweek = leagueStatus.activeGameweek;
        }
        if(leagueStatus.activeGameweek == 0){
          selectedGameweek = leagueStatus.unplayedGameweek;
        }
      } else {
        selectedGameweek = 0;
      }

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
    goto(`/add-fixture-data?id=${fixtureId}&league-id=${league.id}&season-id=${leagueStatus.activeSeasonId}`);
  }

  function closeModal() {
    selectedFixtureId = 0;
    showMoveFixtureModal = false;
    showPostponeFixtureModal = false;
  }

  function filterFixtures(){
    filteredFixtures = fixtures.filter(x => x.gameweek == selectedGameweek);
  }

  $effect(() => {
    if(selectedGameweek > 0){
      filterFixtures();
    }
  });
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  
  <div class="flex w-full">
    <div class="stacked-col w-full rounded-lg shadow-lg">     
      {#if league}
        <div class="flex items-center justify-between w-full mb-6">
          <p class="px-4 md:px-2">{league.name} Fixtures</p>
        </div>

        <div class="flex mb-4">
          <FormComponent label="Select Gameweek">
            <select class="brand-dropdown" bind:value={selectedGameweek}>
              {#each gameweeks.map(week => ({ id: week, label: `Gameweek: ${week}`})) as gameweek}
                <option value={gameweek.id}>{gameweek.label}</option>
              {/each}
            </select>
          </FormComponent>
        </div>

        <div class="px-3 mb-4 md:px-0 md:space-y-4">
          {#if selectedGameweek > 0 && filteredFixtures && filteredFixtures.length > 0}
            {#each filteredFixtures as fixture}
              {@const homeClub = clubs.find(x => x.id == fixture.homeClubId)}
              {@const awayClub = clubs.find(x => x.id == fixture.awayClubId)}
              <FixtureDisplay
                {fixture}
                homeClub={homeClub!}
                awayClub={awayClub!}
                {dropdownVisible}
                onDropdownClick={toggleDropdown}
                onAddFixtureData={loadAddFixtureData}
                onMoveFixture={loadMoveFixture}
                onPostponeFixture={loadPostponeFixture}
              />
            {/each}
          {:else}
            <div class="flex justify-center p-4">
              <p class="text-gray-400">Fixtures Have Not Been Added For This League</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  {#if selectedFixtureId > 0 && showMoveFixtureModal}
    {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
    {@const homeClub = clubs.find(x => x.id == selectedFixture!.homeClubId)}
    {@const awayClub = clubs.find(x => x.id == selectedFixture!.awayClubId)}
    <MoveFixture visible={showMoveFixtureModal} {closeModal} {selectedFixtureId} homeClub={homeClub!} awayClub={awayClub!} selectedGameweek={selectedFixture?.gameweek!} selectedLeagueId={league.id}/>
  {/if}

  {#if selectedFixtureId > 0 && showPostponeFixtureModal}
    {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
    <PostponeFixture visible={showPostponeFixtureModal} {closeModal} selectedFixture={selectedFixture!} selectedLeagueId={league.id}/>
  {/if}

{/if}
