<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { Club, Fixture, League } from "../../../../../declarations/backend/backend.did";
  import RescheduleFixture from "../governance/proposals/fixture/reschedule-fixture.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  
  interface Props {
    leagueId: number
  }

  let { leagueId }: Props = $props();
  
  let isLoading = $state(true);
  
  let league: League | undefined = $state(undefined);
  let clubs: Club[] = $state([]);
  let fixtures: Fixture[] = $state([]);
  let selectedFixture: Fixture | undefined = $state(undefined);
  let selectedSeasonId: number = $state(0);

  let showRescheduleFixture = $state(false);
  let dropdownVisible: number | null = $state(null);
  
  onMount(async () => {
    try {
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error fetching leagues.");
      let leagues = leaguesResult.leagues;
      league = leagues.find(x => x.id == leagueId);


      let clubsResult = await clubStore.getClubs(leagueId);
      if(!clubsResult) throw new Error("Failed to fetch clubs");
      clubs = clubsResult.clubs;

      let fixturesResult = await fixtureStore.getPostponedFixtures(leagueId);
      if(!fixturesResult) throw new Error("Failed to fetch fixtures");
      fixtures = fixturesResult.fixtures;

      let leagueStatusResult = await leagueStore.getLeagueStatus(leagueId);
      if(!leagueStatusResult) throw new Error("Failed to fetch league status");
      let leagueStatus = leagueStatusResult;
      selectedSeasonId = leagueStatus.activeSeasonId;
    } catch (error) {
      console.error("Error fetching postponed fixtures:", error);
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

  function loadRescheduleFixture(fixtureId: number) {
    selectedFixture = fixtures.find(f => f.id === fixtureId);
    showRescheduleFixture = true;
  }

  function closeModal() {
    selectedFixture = undefined;
    showRescheduleFixture = false;
  }
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  {#if fixtures.length > 0}
  <div class="flex w-full">
    <div class="stacked-col w-full rounded-lg shadow-lg">
      {#if league}
        <div class="flex items-center justify-between w-full mb-6">
          <p class="px-4 md:px-2">{league.name} Postponed Fixtures</p>
        </div>
        <div class="px-3 mb-4 md:px-0 md:space-y-4">
          {#if fixtures}
              {#each fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff)) as fixture}
                {@const homeClub = clubs.find(x => x.id == fixture.homeClubId)}
                {@const awayClub = clubs.find(x => x.id == fixture.awayClubId)}
                
                <!-- // TODO
                <FixtureDisplay
                  {fixture}
                  homeClub={homeClub!}
                  awayClub={awayClub!}
                  {dropdownVisible}
                  onDropdownClick={toggleDropdown}
                  onRescheduleFixture={loadRescheduleFixture}
                />          
                -->
              {/each}
          {/if}
        </div>
      {/if}
    </div>
    </div>
  {:else}
    <div class="flex justify-center p-4">
      <p class="text-gray-400">Currently there are no postponed fixtures</p>
    </div>
  {/if}
  {#if selectedFixture && showRescheduleFixture}
    <RescheduleFixture visible={showRescheduleFixture} {closeModal} {selectedFixture} {selectedSeasonId}  selectedLeagueId={leagueId}/>
  {/if}
{/if}
