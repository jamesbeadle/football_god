<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { Club, Fixture, League } from "../../../../../declarations/backend/backend.did";
  
  import MoveFixture from "../governance/proposals/fixture/move-fixture.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PostponeFixture from "../governance/proposals/fixture/postpone-fixture.svelte";
  import FixtureDisplay from "./fixture-display.svelte";
  import FormComponent from "../shared/form-component.svelte";
  
  interface Props {
    leagueId: number
  }

  let { leagueId }: Props = $props();

  let isLoading = $state(true);
  let league: League | undefined = $state(undefined); 
  let clubs: Club[] = $state([]);
  let fixtures: Fixture[] = $state([]);
  let fitleredFixtures: Fixture[] = $state([]);
  let selectedGameweek: number = $state(1);
  let selectedFixtureId: number = $state(0);
  let dropdownVisible: number | null = $state(null);
  let gameweeks: number[] = $state([]);
  let gameweekOptions: { id: number; label: string }[] = $state([]);
  let showMoveFixtureModal = $state(false);
  let showPostponeFixtureModal = $state(false);
  
  onMount(async () => {
    try {
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error fetching leagues.");
      let leagues = leaguesResult.leagues;
      league = leagues.find(x => x.id == leagueId);
    
      let clubsResult = await clubStore.getClubs(league?.id!);
      if(!clubsResult) throw new Error("Error loading clubs")
      clubs = clubsResult.clubs;

      let leagueStatusResult = await leagueStore.getLeagueStatus(league?.id!);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        var leagueStatus = leagueStatusResult;
  
      let fixturesResult = await fixtureStore.getFixtures(leagueId, leagueStatus?.activeSeasonId ?? 1);
      if(!fixturesResult) throw new Error("Failed to fetch fixtures");
      fixtures = fixturesResult.fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff));


      const highestGameweek = fixtures.reduce((max, fixture) => Math.max(max, fixture.gameweek), 0);
      gameweeks = Array.from({ length: Number(highestGameweek) }, (_, i) => i + 1);
      
      gameweekOptions = [
        { id: 0, label: "Select Gameweek" },
        ...gameweeks.map(week => ({
          id: week,
          label: `Gameweek: ${week}`
        }))
      ];
      
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
    let leagueStatusResult = await leagueStore.getLeagueStatus(leagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        var leagueStatus = leagueStatusResult;
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

  function filterFixtures(){
    isLoading = true;
    fitleredFixtures = fixtures.filter(x => x.gameweek == selectedGameweek);
    isLoading = false;
  }

  function handleGameweekChange(value: string | number) {
    selectedGameweek = Number(value);
    filterFixtures();
  }
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
              {#each gameweekOptions as gameweek}
                <option value={gameweek.id}>{gameweek.label}</option>
              {/each}
            </select>
          </FormComponent>
        </div>

        <div class="px-3 mb-4 md:px-0 md:space-y-4">
          {#if selectedGameweek > 0}
            {#if fixtures}
              {#each fitleredFixtures as fixture}
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
            {/if}
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
    <MoveFixture visible={showMoveFixtureModal} {closeModal} {selectedFixtureId} homeClub={homeClub!} awayClub={awayClub!} selectedGameweek={selectedFixture?.gameweek!} selectedLeagueId={leagueId}/>
  {/if}

  {#if selectedFixtureId > 0 && showPostponeFixtureModal}
    {@const selectedFixture = fixtures.find(x => x.id == selectedFixtureId)}
    <PostponeFixture visible={showPostponeFixtureModal} {closeModal} selectedFixture={selectedFixture!} selectedLeagueId={leagueId}/>
  {/if}

{/if}
