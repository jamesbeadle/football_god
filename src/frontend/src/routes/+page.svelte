<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";
  
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  
  import { leagueStore } from "$lib/stores/league-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { bettingStore } from "$lib/stores/betting-store";
  import { clubStore } from "$lib/stores/club-store";
  
  import { convertDateToReadable } from "$lib/utils/helpers";
  import type { FootballLeagueDTO, FixtureDTO, HomePageFixtureDTO, LeagueId, ClubDTO, FixtureId } from "../../../declarations/backend/backend.did";
    import { goto } from "$app/navigation";

  let isLoading = true;
  let leagues: FootballLeagueDTO[] = [];
  let leagueFixtures: Record<LeagueId, FixtureDTO[]> = {};
  let leagueClubs: Record<number, Record<number, string>> = {};
  let expandedLeagues: Record<LeagueId, boolean> = {};
  let loadingFixtures: Record<LeagueId, boolean> = {};  
  let bettingFixtureDTOs: Record<LeagueId, HomePageFixtureDTO[]> = {};

  let selectedGameweeks: Record<LeagueId, number> = {}; //TODO: Add gameweek filter

  onMount(async () => {
    try {
      leagues = await leagueStore.getLeagues();
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      isLoading = false;
    }
  });

  async function fetchClubs(leagueId: LeagueId) {
    try {
      const clubsData = await clubStore.getClubs(leagueId);
      leagueClubs[leagueId] = {};
      clubsData.forEach((club) => {
        leagueClubs[leagueId][club.id] = club.name;
      });
    } catch (error) {
      console.error(`Error fetching clubs for league ${leagueId}:`, error);
    }
  }

  async function fetchLeagueData(leagueId: LeagueId) {
    if (!leagueFixtures[leagueId]) {
      loadingFixtures[leagueId] = true;
      try {
        leagueFixtures[leagueId] = await fixtureStore.getFixtures(leagueId);
        await fetchClubs(leagueId);
        bettingFixtureDTOs[leagueId] = await bettingStore.getLeagueFixtures(leagueId);
      } catch (error) {
        console.error(`Error fetching data for league ${leagueId}:`, error);
      } finally {
        loadingFixtures[leagueId] = false;
      }
    }
  }

  const toggleLeague = async (leagueId: LeagueId) => {
    console.log(`toggling league ${leagueId}`)
    if (expandedLeagues[leagueId]) {
      expandedLeagues = { ...expandedLeagues, [leagueId]: false };
    } else {
      expandedLeagues = { ...expandedLeagues, [leagueId]: true };
      if (!leagueFixtures[leagueId]) {
        await fetchLeagueData(leagueId);
      }
    }
    console.log("expandedLeagues")
    console.log(expandedLeagues)
  };

  function loadFixtureEvent(leagueId: LeagueId, fixtureId: FixtureId){
    goto(`/fixture-event?leagueId=${leagueId}&fixtureId=${fixtureId}`)
  };

</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <p class="text-lg mb-4">Home</p>
    <div class="flex flex-col w-full space-y-2">
      {#each leagues as league}
        <div class={`${expandedLeagues[league.id] ? `bg-BrandPurple` : `bg-BrandLightGray` }  rounded shadow`}>
          <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-2 cursor-pointer bg-transparent border-0 text-left"
            on:click={() => toggleLeague(league.id)}
          >
            <p class="text-sm font-medium">{league.name}</p>
            {#if expandedLeagues[league.id]}
              <ArrowUp className="w-5 h-5 text-gray-600" />
            {:else}
              <ArrowDown className="w-5 h-5 text-gray-600" />
            {/if}
          </button>

          {#if expandedLeagues[league.id] && !loadingFixtures[league.id]}
            <div class="px-4 py-2 bg-BrandDarkGray text-sm space-y-2">
              {#each leagueFixtures[league.id] as fixture}
                {@const odds = bettingFixtureDTOs[league.id].find((odds) => odds.fixtureId === fixture.id)}
                {#if odds}
                  <div class="flex justify-between items-center">
                    <div>
                      <p>
                        {leagueClubs[league.id]?.[fixture.homeClubId] || "Unknown"} vs 
                        {leagueClubs[league.id]?.[fixture.awayClubId] || "Unknown"}
                      </p>
                      <p class="text-xs text-gray-400">{convertDateToReadable(Number(fixture.kickOff))}</p>
                    </div>
                    <div class="flex space-x-4">
                      {#if bettingFixtureDTOs[league.id]}
                        <p>{odds?.homeOdds?.toFixed(2) || "N/A"}</p>
                        <p>{odds?.drawOdds?.toFixed(2) || "N/A"}</p>
                        <p>{odds?.awayOdds?.toFixed(2) || "N/A"}</p>
                        <button class="brand-button" on:click={() => loadFixtureEvent(league.id, fixture.id)}>Detailed Odds</button>
                      {/if}
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}

          {#if loadingFixtures[league.id]}
            <div class="px-4 py-2 bg-BrandDarkGray text-sm space-y-2">
              <LocalSpinner />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Layout>
