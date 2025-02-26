<script lang="ts">
    import { onMount } from "svelte";
    import { clubStore } from "$lib/stores/club-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import {
      convertFixtureStatus,
      formatUnixDateToSmallReadableDate,
      formatUnixTimeToTime,
      getFixturesWithTeams,
    } from "../../utils/helpers";
    import type { FixtureWithClubs } from "$lib/types/fixture-with-clubs";
    //import { storeManager } from "$lib/managers/store-manager";
    import LocalSpinner from "../shared/local-spinner.svelte";
    import FixtureTypeFilter from "../../components/shared/filters/fixture-type-filter.svelte";
    import { writable } from "svelte/store";
    import TeamFixturesTableHeader from "../club/team-fixtures-table-header.svelte";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import type { ClubDTO } from "../../../../../declarations/data_canister/data_canister.did";
  
    export let club: ClubDTO;
    export let leagueId: number;
  
    let fixturesWithTeams: FixtureWithClubs[] = [];
    let selectedFixtureType = writable(-1);
  
    let isLoading = true;
  
    $: filteredFixtures = fixturesWithTeams
      .filter(
        ({ fixture }) => {
          if($selectedFixtureType == -1 ) { return true; }
          if($selectedFixtureType == 0 && fixture.homeClubId === club.id) { return true; }
          if($selectedFixtureType == 1 && fixture.awayClubId === club.id) { return true; }
        } 
      ).sort((a, b) => a.fixture.gameweek - b.fixture.gameweek)
  
    onMount(async () => {
        //await storeManager.syncStores();
        const fixtures = await fixtureStore.getFixtures(leagueId, 1);
        const clubs = await clubStore.getClubs(leagueId);
        
        const clubFixtures = fixtures.filter(fixture => 
            fixture.homeClubId === club.id || fixture.awayClubId === club.id
        );
        
        fixturesWithTeams = getFixturesWithTeams(clubs, clubFixtures);
        isLoading = false;
    });
  </script>
  
  {#if isLoading}
    <LocalSpinner />
  {:else}
    <div class="flex flex-col">
      <FixtureTypeFilter {selectedFixtureType} />
      <TeamFixturesTableHeader />
  
      {#each filteredFixtures as { fixture, homeClub, awayClub }}
        <div
          class={`flex items-center border-b border-gray-700 px-4 py-4
          ${ convertFixtureStatus(fixture.status) === 0 ? "text-gray-400" : "text-white" }`}
        >
          <div class="flex-grow hidden w-1/6 md:flex">{fixture.gameweek}</div>
          <div class="flex-grow w-1/6 md:hidden">{fixture.gameweek}</div>
          <div class="flex-grow w-1/2 pl-2">
            <div class="flex items-center space-x-2">
              <a class="flex items-center" href={`/club?id=${fixture.homeClubId}&leagueId=${leagueId}`}>
                <BadgeIcon primaryColour={homeClub?.primaryColourHex} secondaryColour={homeClub?.secondaryColourHex} thirdColour={homeClub?.thirdColourHex} className="h-6 mr-2" />
                <span>{homeClub ? homeClub.friendlyName : ""}</span>
              </a>
              <span>vs</span>
              <a class="flex items-center" href={`/club?id=${fixture.awayClubId}&leagueId=${leagueId}`}>
                <BadgeIcon primaryColour={awayClub?.primaryColourHex} secondaryColour={awayClub?.secondaryColourHex} thirdColour={awayClub?.thirdColourHex} className="h-6 mr-2" />
                <span>{awayClub ? awayClub.friendlyName : ""}</span>
              </a>
            </div>
          </div>
          <div class="flex-grow w-1/4 pl-2">
            {formatUnixDateToSmallReadableDate(fixture.kickOff)}
          </div>
          <div class="flex-grow hidden w-1/6 text-center md:flex">
            {formatUnixTimeToTime(fixture.kickOff)}
          </div>
          <div class="flex-grow w-1/6 text-center md:w-1/4">
            {#if convertFixtureStatus(fixture.status) === 0}
              -
            {:else}
              {fixture.homeGoals} - {fixture.awayGoals}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}