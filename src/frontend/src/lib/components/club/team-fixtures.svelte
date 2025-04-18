<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { leagueStore } from "$lib/stores/league-store";
    import { clubStore } from "$lib/stores/club-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import {
      convertFixtureStatus,
      formatUnixDateToSmallReadableDate,
      formatUnixTimeToTime,
      getFixturesWithTeams,
    } from "../../utils/helpers";
    import type { FixtureWithClubs } from "$lib/types/fixture-with-clubs";
    import type { Club } from "../../../../../declarations/backend/backend.did";
    import LocalSpinner from "../shared/local-spinner.svelte";
    import FixtureTypeFilter from "../../components/shared/filters/fixture-type-filter.svelte";
    import TeamFixturesTableHeader from "../club/team-fixtures-table-header.svelte";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  
    interface Props {
      club: Club;
      leagueId: number;
    }
    let { club, leagueId }: Props = $props();
  
    let fixturesWithTeams: FixtureWithClubs[] = $state([]);
    let selectedFixtureType = writable(-1);
  
    let isLoading = $state(true);
    
    $effect(() => {
      fixturesWithTeams = fixturesWithTeams
        .filter(({ fixture }) => {
          if ($selectedFixtureType === -1) return true;
          if ($selectedFixtureType === 0 && fixture.homeClubId === club.id) return true;
          if ($selectedFixtureType === 1 && fixture.awayClubId === club.id) return true;
          return false;
        })
        .sort((a, b) => a.fixture.gameweek - b.fixture.gameweek);
    });
    
    onMount(async () => {
        //await storeManager.syncStores();
        let leagueStatusResult = await leagueStore.getLeagueStatus(leagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;

        let fixturesResult = await fixtureStore.getFixtures(leagueId, leagueStatus?.activeSeasonId ?? 1);
        if(!fixturesResult) throw new Error("Failed to fetch fixtures");
        let fixtures = fixturesResult.fixtures;
        
        let clubsResult = await clubStore.getClubs(leagueId);
        if(!clubsResult) throw new Error("Failed to fetch clubs");
        let clubs = clubsResult.clubs;
        
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
    <div class="stacked-column">
      <FixtureTypeFilter {selectedFixtureType} />
      <TeamFixturesTableHeader />
  
      {#each fixturesWithTeams as { fixture, homeClub, awayClub }}
        <div
          class={`flex items-center border-b border-gray-700 px-4 py-4
          ${ convertFixtureStatus(fixture.status) === 0 ? "text-gray-400" : "text-white" }`}
        >
          <div class="flex hidden w-1/6 md:flex">{fixture.gameweek}</div>
          <div class="flex w-1/6 md:hidden">{fixture.gameweek}</div>
          <div class="flex w-1/2 pl-2">
            <div class="flex items-center space-x-2">
              <a class="flex items-center" href={`/club?id=${fixture.homeClubId}&leagueId=${leagueId}`}>
                <BadgeIcon primaryColour={homeClub?.primaryColourHex ?? "white"} secondaryColour={homeClub?.secondaryColourHex ?? "white"} thirdColour={homeClub?.thirdColourHex ?? "white"} className="h-6 mr-2" />
                <span>{homeClub ? homeClub.friendlyName : ""}</span>
              </a>
              <span>vs</span>
              <a class="flex items-center" href={`/club?id=${fixture.awayClubId}&leagueId=${leagueId}`}>
                <BadgeIcon primaryColour={awayClub?.primaryColourHex ?? "white"} secondaryColour={awayClub?.secondaryColourHex ?? "white"} thirdColour={awayClub?.thirdColourHex ?? "white"} className="h-6 mr-2" />
                <span>{awayClub ? awayClub.friendlyName : ""}</span>
              </a>
            </div>
          </div>
          <div class="flex w-1/4 pl-2">
            {formatUnixDateToSmallReadableDate(fixture.kickOff)}
          </div>
          <div class="flex hidden w-1/6 text-center md:flex">
            {formatUnixTimeToTime(fixture.kickOff)}
          </div>
          <div class="flex w-1/6 text-center md:w-1/4">
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