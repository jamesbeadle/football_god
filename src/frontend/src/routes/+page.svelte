<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import Layout from "./Layout.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import Betslip from "$lib/components/bettings/betslip.svelte";

  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  import ArrowLeft from "$lib/icons/ArrowLeft.svelte";
  import ArrowRight from "$lib/icons/ArrowRight.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import OddsIcon from "$lib/icons/OddsIcon.svelte";
  import BetSelectedIcon from "$lib/icons/BetSelectedIcon.svelte";

  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { bettingStore } from "$lib/stores/betting-store";
  import { betSlipStore } from "$lib/stores/bet-slip-store";

  import { storeManager } from "$lib/managers/store-manager";

  import { convertDateToReadable } from "$lib/utils/helpers";

  import type {
    FootballLeagueDTO,
    FixtureDTO,
    ClubDTO,
    FixtureId,
    LeagueId,
    GameweekNumber
  } from "../../../declarations/data_canister/data_canister.did";

  import type { Category, HomePageFixtureDTO, SelectionDetail } from "../../../declarations/backend/backend.did";
  import { betSlipDataStore } from "$lib/stores/bet-slip-data-store";
  import { buildBetUiDescription } from "$lib/utils/buildBetUiDescription";

  let isLoading = true;
  let isBetSlipExpanded = false;

  let leagues: FootballLeagueDTO[] = [];
  let leagueFixtures: Record<LeagueId, FixtureDTO[]> = {};
  let leagueClubs: Record<LeagueId, Record<number, ClubDTO>> = {};
  let allBettingFixtures: Record<LeagueId, HomePageFixtureDTO[]> = {};
  let expandedLeagues: Record<LeagueId, boolean> = {};
  let loadingFixtures: Record<LeagueId, boolean> = {};
  let selectedGameweeks: Record<LeagueId, GameweekNumber> = {};
  let leagueTotalGameweeks: Record<LeagueId, number> = {};

  $: selectedBets = $betSlipStore.bets;

  onMount(async () => {
    try {
      leagues = await leagueStore.getLeagues();
      const existingBets = $betSlipStore.bets;
      const toggledLeagues = new Set<number>();
      
      if (existingBets.length > 0) {
        for (const bet of existingBets) {
          if (!expandedLeagues[bet.leagueId] && !toggledLeagues.has(bet.leagueId)) {
            await toggleLeague(bet.leagueId);
            expandedLeagues[bet.leagueId] = false;
            toggledLeagues.add(bet.leagueId);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      isLoading = false;
    }
  });

  async function fetchLeagueData(leagueId: LeagueId) {
    loadingFixtures[leagueId] = true;
    try {
      leagueFixtures[leagueId] = await fixtureStore.getFixtures(leagueId);
      await fetchClubs(leagueId);
      const leagueStatus = await leagueStore.getLeagueStatus(leagueId);
      selectedGameweeks[leagueId] = leagueStatus.unplayedGameweek;
      leagueTotalGameweeks[leagueId] = leagueStatus.totalGameweeks;
      const bettingFixtures = await bettingStore.getBettableHomepageFixtures(leagueId);
      allBettingFixtures[leagueId] = bettingFixtures;
    } catch (error) {
      console.error(`Error fetching data for league ${leagueId}:`, error);
    } finally {
      loadingFixtures[leagueId] = false;
    }
  }

  async function fetchClubs(leagueId: LeagueId) {
    try {
      const clubsData = await clubStore.getClubs(leagueId);
      leagueClubs[leagueId] = {};
      clubsData.forEach((club: ClubDTO) => {
        leagueClubs[leagueId][club.id] = club;
      });
    } catch (error) {
      console.error(`Error fetching clubs for league ${leagueId}:`, error);
    }
  }

  async function toggleLeague(leagueId: LeagueId) {
    if (expandedLeagues[leagueId]) {
      expandedLeagues[leagueId] = false;
    } else {
      expandedLeagues[leagueId] = true;
      loadingFixtures[leagueId] = true;

      try {
        //await storeManager.syncStores(leagueId);
        await fetchLeagueData(leagueId);
      } catch (error) {
        console.error(`Error while toggling league ${leagueId}:`, error);
      } finally {
        loadingFixtures[leagueId] = false;
      }
    }
  }

  function priorGameweek(leagueId: LeagueId) {
    const current = selectedGameweeks[leagueId];
    if (current > 1) {
      selectedGameweeks[leagueId] = current - 1;
    }
  }

  function nextGameweek(leagueId: LeagueId) {
    const current = selectedGameweeks[leagueId];
    const maxGW = leagueTotalGameweeks[leagueId] ?? 1;
    if (current < maxGW) {
      selectedGameweeks[leagueId] = current + 1;
    }
  }

  function filteredBettingFixtures(leagueId: LeagueId) {
    const gw = selectedGameweeks[leagueId];
    const all = allBettingFixtures[leagueId] ?? [];
    return all.filter((f) => f.gameweek === gw);
  }

  function loadFixtureEvent(leagueId: number, fixtureId: number) {
    goto(`/fixture-event?leagueId=${leagueId}&fixtureId=${fixtureId}`);
  }

  function toggleBetSlip() {
    isBetSlipExpanded = !isBetSlipExpanded;
  }

  async function toggleBetSelection(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
  odds: number
) {
    const isCurrentlySelected = betSlipStore.isSelected(leagueId, fixtureId, category, detail);
    if (isCurrentlySelected) {
      betSlipStore.removeBet(leagueId, fixtureId, category, detail);
      return;
    }

    const { clubs, players } = await betSlipDataStore.ensureLeagueData(leagueId);
    const description = buildBetUiDescription(detail, clubs, players);
    
    betSlipStore.addBet({
      leagueId,
      fixtureId,
      status: { Unsettled: null },
      result: { Open: null },
      selectionType: category,
      selectionDetail: detail,
      odds,
      stake: 0n,
      winnings: 0,
      expectedReturns: 0n,
      uiDescription: description,
    });
}

  function isBetSelected(
    leagueId: number,
    fixtureId: number,
    category: Category,
    detail: SelectionDetail
  ) {
    return selectedBets.some(bet => 
      bet.leagueId === leagueId && 
      bet.fixtureId === fixtureId && 
      JSON.stringify(bet.selectionType) === JSON.stringify(category) && 
      JSON.stringify(bet.selectionDetail) === JSON.stringify(detail)
    );
  }

  function getOddsForFixture(leagueId: LeagueId, fixtureId: number) {
    return filteredBettingFixtures(leagueId).find((x) => x.fixtureId === fixtureId);
  }

  function selectCorrectResultHome(leagueId: number, fixtureId: number, odds: number) {
    const category: Category = { 'CorrectResult': null };
    const detail: SelectionDetail = {
      'CorrectResult': {
        matchResult: { 'HomeWin': null }
      }
    };
    toggleBetSelection(leagueId, fixtureId, category, detail, odds);
  }

  function selectCorrectResultDraw(leagueId: number, fixtureId: number, odds: number) {
    const category: Category = { 'CorrectResult': null };
    const detail: SelectionDetail = {
      'CorrectResult': {
        matchResult: { 'Draw': null }
      }
    };
    toggleBetSelection(leagueId, fixtureId, category, detail, odds);
  }

  function selectCorrectResultAway(leagueId: number, fixtureId: number, odds: number) {
    const category: Category = { 'CorrectResult': null };
    const detail: SelectionDetail = {
      'CorrectResult': {
        matchResult: { 'AwayWin': null }
      }
    };
    toggleBetSelection(leagueId, fixtureId, category, detail, odds);
  }
</script>

<Layout>
  <div class="flex flex-col md:flex-row">
    <div class="flex-1 md:block">
      {#if isLoading}
        <FullScreenSpinner />
      {:else}
        <div class="page-panel">
          <div class="page-panel-header">Home</div>
          <div class="page-panel-bar-format">
            {#each leagues as league}
              <div
                class="{expandedLeagues[league.id] ? 'bg-BrandPurple' : 'bg-BrandLightGray'} rounded shadow"
              >
                <button
                  type="button"
                  class="page-panel-bar-button"
                  on:click={() => toggleLeague(league.id)}
                >
                  <p class="page-panel-bar-button-title">{league.name}</p>
                  {#if expandedLeagues[league.id]}
                    <ArrowUp className="w-5 h-5 text-gray-600" />
                  {:else}
                    <ArrowDown className="w-5 h-5 text-gray-600" />
                  {/if}
                </button>

                {#if expandedLeagues[league.id]}
                  {#if loadingFixtures[league.id]}
                    <div class="page-panel-bar-spinner">
                      <LocalSpinner />
                    </div>
                  {:else}
                    <div class="page-panel-table-container">
                      <div class="page-panel-table-header">
                        <div class="flex items-center justify-center w-5/12 py-2 md:py-3">
                          <button
                            class="text-gray-500 hover:text-gray-700"
                            on:click={() => priorGameweek(league.id)}
                          >
                            <ArrowLeft className="w-4" />
                          </button>
                          <div class="mx-2 sm:mx-3 md:mx-2 lg:mx-4">
                            <span class="text-[10px] tracking-wider uppercase sm:text-xs md:text-xs lg:text-sm whitespace-nowrap text-center">
                              Gameweek
                              <span class="inline md:block lg:inline">
                                {selectedGameweeks[league.id]}
                              </span>
                            </span>
                          </div>
                          <button
                            class="text-gray-500 hover:text-gray-700"
                            on:click={() => nextGameweek(league.id)}
                          >
                            <ArrowRight className="w-4" />
                          </button>
                        </div>

                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">
                          Home
                        </div>
                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">
                          Draw
                        </div>
                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">
                          Away
                        </div>
                        <div class="hidden w-1/12 lg:block"></div>
                      </div>

                      <div class="relative">
                        <div class="absolute inset-0 grid grid-cols-12 pointer-events-none">
                          <div class="col-span-5"></div>
                          <div class="col-span-2 bg-BrandGray border-x border-BrandOddsDivider"></div>
                          <div class="col-span-2 border-r bg-BrandGray border-BrandOddsDivider"></div>
                          <div class="col-span-2 border-r bg-BrandGray border-BrandOddsDivider"></div>
                          <div class="col-span-1 border-r bg-BrandGray border-BrandOddsDivider lg:block"></div>
                        </div>

                        {#each leagueFixtures[league.id] as fixture}
                          {@const oddsObj = getOddsForFixture(league.id, fixture.id)}
                          {#if oddsObj}
                            <div class="relative py-2 border-b border-BrandOddsDivider last:border-b-0">
                              <div class="grid grid-cols-12">
                                <div class="col-span-5 pt-2 pr-2 md:pr-4">
                                  <div class="flex flex-col px-4 space-y-3 text-md">
                                    <div class="flex items-center space-x-2 md:space-x-3">
                                      <BadgeIcon
                                        primaryColour={leagueClubs[league.id]?.[fixture.homeClubId]?.primaryColourHex}
                                        secondaryColour={leagueClubs[league.id]?.[fixture.homeClubId]?.secondaryColourHex}
                                        thirdColour={leagueClubs[league.id]?.[fixture.homeClubId]?.thirdColourHex}
                                        className="flex-shrink-0 w-4 md:w-6"
                                      />
                                      <span class="text-xs truncate md:text-base">
                                        {leagueClubs[league.id]?.[fixture.homeClubId]?.name || "Unknown"}
                                      </span>
                                    </div>
                                    <div class="flex items-center space-x-2 md:space-x-3">
                                      <BadgeIcon
                                        primaryColour={leagueClubs[league.id]?.[fixture.awayClubId]?.primaryColourHex}
                                        secondaryColour={leagueClubs[league.id]?.[fixture.awayClubId]?.secondaryColourHex}
                                        thirdColour={leagueClubs[league.id]?.[fixture.awayClubId]?.thirdColourHex}
                                        className="flex-shrink-0 w-4 md:w-6"
                                      />
                                      <span class="text-xs truncate md:text-base">
                                        {leagueClubs[league.id]?.[fixture.awayClubId]?.name || "Unknown"}
                                      </span>
                                    </div>

                                    <span class="mt-1 text-[10px] md:text-xs text-gray-400">
                                      {convertDateToReadable(Number(fixture.kickOff))}
                                    </span>
                                  </div>
                                </div>

                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button
                                    class="
                                      flex items-center justify-center w-12 h-12 text-xs rounded md:text-base
                                      hover:bg-BrandGray/80 transition-colors duration-200
                                      {isBetSelected(
                                        league.id,
                                        fixture.id,
                                        { 'CorrectResult': null },
                                        { 'CorrectResult': { matchResult: { 'HomeWin': null } } }
                                      ) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => 
                                      selectCorrectResultHome(league.id, fixture.id, oddsObj.homeOdds || 0)
                                    }
                                  >
                                    {#if isBetSelected(
                                      league.id,
                                      fixture.id,
                                      { 'CorrectResult': null },
                                      { 'CorrectResult': { matchResult: { 'HomeWin': null } } }
                                    )}
                                      <BetSelectedIcon className="w-8 h-8 fill-BrandPurple" />
                                    {:else}
                                      <span>{oddsObj.homeOdds?.toFixed(2) || "N/A"}</span>
                                    {/if}
                                  </button>
                                </div>

                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button
                                    class="
                                      flex items-center justify-center gap-2 p-2 text-xs rounded md:text-base
                                      hover:bg-BrandGray/80 transition-colors duration-200
                                      {isBetSelected(
                                        league.id,
                                        fixture.id,
                                        { 'CorrectResult': null },
                                        { 'CorrectResult': { matchResult: { 'Draw': null } } }
                                      ) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => 
                                      selectCorrectResultDraw(league.id, fixture.id, oddsObj.drawOdds || 0)
                                    }
                                  >
                                    {#if isBetSelected(
                                      league.id,
                                      fixture.id,
                                      { 'CorrectResult': null },
                                      { 'CorrectResult': { matchResult: { 'Draw': null } } }
                                    )}
                                      <BetSelectedIcon className="w-8 h-8 fill-BrandPurple" />
                                    {:else}
                                      <span>{oddsObj.drawOdds?.toFixed(2) || "N/A"}</span>
                                    {/if}
                                  </button>
                                </div>

                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button
                                    class="
                                      flex items-center justify-center gap-2 p-2 text-xs rounded md:text-base
                                      hover:bg-BrandGray/80 transition-colors duration-200
                                      {isBetSelected(
                                        league.id,
                                        fixture.id,
                                        { 'CorrectResult': null },
                                        { 'CorrectResult': { matchResult: { 'AwayWin': null } } }
                                      ) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => 
                                      selectCorrectResultAway(league.id, fixture.id, oddsObj.awayOdds || 0)
                                    }
                                  >
                                    {#if isBetSelected(
                                      league.id,
                                      fixture.id,
                                      { 'CorrectResult': null },
                                      { 'CorrectResult': { matchResult: { 'AwayWin': null } } }
                                    )}
                                      <BetSelectedIcon className="w-8 h-8 fill-BrandPurple" />
                                    {:else}
                                      <span>{oddsObj.awayOdds?.toFixed(2) || "N/A"}</span>
                                    {/if}
                                  </button>
                                </div>

                                <div class="flex justify-center col-span-1">
                                  <button
                                    class="p-1 md:p-2"
                                    aria-label="View detailed odds"
                                    on:click={() => loadFixtureEvent(league.id, fixture.id)}
                                  >
                                    <OddsIcon className="w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          {/if}
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="flex-shrink-0 lg:ml-4 lg:w-80">
      <div class="hidden lg:block lg:sticky lg:top-4">
        <Betslip
          leagueData={leagues.reduce((acc, league) => ({...acc, [league.id]: league}), {})}
          fixtureData={Object.entries(leagueFixtures).reduce((acc, [leagueId, fixtures]) => ({
            ...acc,
            ...fixtures.reduce((facc, fixture) => ({
              ...facc,
              [fixture.id]: { ...fixture, leagueId: Number(leagueId) }
            }), {})
          }), {})}
          clubsData={leagueClubs}
        />
      </div>

      <div
        class="
          fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl
          border-BrandOddsDivider bg-BrandGray lg:hidden
          {isBetSlipExpanded ? 'hidden' : ''}
          md:left-24 md:right-12
        "
      >
        <div class="w-full p-4 bg-white rounded-2xl md:mx-0">
          <button class="flex items-center w-full text-left" on:click={toggleBetSlip}>
            <div class="flex items-center">
              <span class="flex items-center justify-center w-12 h-10 mr-3 text-xl font-medium text-white rounded-full bg-BrandPurple">
                Bets
              </span>
              <span class="text-xl font-semibold text-black">Bet Slip</span>
            </div>
          </button>
        </div>
      </div>

      {#if isBetSlipExpanded}
        <div class="lg:hidden">
          <Betslip 
            bind:isExpanded={isBetSlipExpanded}
            leagueData={leagues.reduce((acc, league) => ({...acc, [league.id]: league}), {})}
            fixtureData={Object.entries(leagueFixtures).reduce((acc, [leagueId, fixtures]) => ({
              ...acc,
              ...fixtures.reduce((facc, fixture) => ({
                ...facc,
                [fixture.id]: { ...fixture, leagueId: Number(leagueId) }
              }), {})
            }), {})}
            clubsData={leagueClubs}
          />
        </div>
      {/if}
    </div>
  </div>
</Layout>