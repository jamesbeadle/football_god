<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { formatUnixTimeToTime } from "$lib/utils/helpers";
  import type { ClubDTO, FixtureDTO, FootballLeagueDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import RescheduleFixture from "../governance/fixture/reschedule-fixture.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
  
  let isLoading = true;

  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let fixtures: FixtureDTO[] = [];
  let selectedFixture: FixtureDTO | undefined;
  let selectedSeasonId: number = 0;

  let showRescheduleFixture = false;
  let dropdownVisible: number | null = null;
  
  onMount(async () => {
    try {
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
      fixtures = await fixtureStore.getPostponedFixtures(leagueId);
      let leagueStatus = await leagueStore.getLeagueStatus(leagueId);
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

  function loadRescheduleFixture(fixture: FixtureDTO) {
    selectedFixture = fixture;
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
  
  <div class="flex w-full">
    <div class="w-full flex flex-col rounded-lg shadow-lg">
      
      {#if league}
      
        <div class="flex justify-between items-center w-full mb-4">
            <h1>{league.name} Fixtures</h1>
        </div>

        <div class="space-y-4">
          {#if fixtures}
              {#each fixtures.sort((a, b) => Number(a.kickOff) - Number(b.kickOff)) as fixture}
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
                        <button class="dropdown-link" on:click={() => loadRescheduleFixture(fixture)}>Reschedule Fixture</button>
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

  {#if selectedFixture && showRescheduleFixture}
    <RescheduleFixture visible={showRescheduleFixture} {closeModal} {selectedFixture} {selectedSeasonId}  selectedLeagueId={leagueId}/>
  {/if}

{/if}
