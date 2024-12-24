<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import Betslip from "$lib/components/shared/betslip.svelte";
  
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  import OddsIcon from "$lib/icons/OddsIcon.svelte";
  import BetSelectedIcon from "$lib/icons/BetSelectedIcon.svelte";
  
  import { leagueStore } from "$lib/stores/league-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { bettingStore } from "$lib/stores/betting-store";
  import { clubStore } from "$lib/stores/club-store";

  import type { BetSelection } from "$lib/types/betting";
  
  import { convertDateToReadable } from "$lib/utils/helpers";
  import type { FootballLeagueDTO, FixtureDTO, HomePageFixtureDTO, LeagueId, ClubDTO, FixtureId } from "../../../declarations/backend/backend.did";
  import { goto } from "$app/navigation";

  let isLoading = true;
  let leagues: FootballLeagueDTO[] = [];
  let leagueFixtures: Record<LeagueId, FixtureDTO[]> = {};
  let leagueClubs: Record<number, Record<number, ClubDTO>> = {};
  let expandedLeagues: Record<LeagueId, boolean> = {};
  let loadingFixtures: Record<LeagueId, boolean> = {};  
  let bettingFixtureDTOs: Record<LeagueId, HomePageFixtureDTO[]> = {};

  let selectedGameweeks: Record<LeagueId, number> = {}; //TODO: Add gameweek filter
  let selectedBets: BetSelection[] = [];  
  let isBetSlipExpanded = false;
  let selectedOdds: Record<string, number> = {};
  $: selectedOddsState = selectedOdds;

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
        leagueClubs[leagueId][club.id] = club;
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
    if (expandedLeagues[leagueId]) {
      expandedLeagues = { ...expandedLeagues, [leagueId]: false };
    } else {
      expandedLeagues = { ...expandedLeagues, [leagueId]: true };
      if (!leagueFixtures[leagueId]) {
        await fetchLeagueData(leagueId);
      }
    }
  };

  function loadFixtureEvent(leagueId: LeagueId, fixtureId: FixtureId){
    goto(`/fixture-event?leagueId=${leagueId}&fixtureId=${fixtureId}`)
  };

  function toggleBetSlip() {
    isBetSlipExpanded = !isBetSlipExpanded;
  }

  function isBetSelected(odds: number, description: string): boolean {
    return selectedOddsState[description] === odds;
  }

</script>

<Layout>
  <div class="flex flex-col md:flex-row">
    <div class="flex-1 md:block">
      {#if isLoading}
        <FullScreenSpinner />
      {:else}
        <div class="flex flex-col w-full min-h-screen px-1 py-4 md:px-0 md:py-0 bg-BrandDark">
          <div class="flex flex-col w-full min-h-screen pb-24 rounded-xl bg-BrandGray md:pb-28 lg:pb-0">
            <p class="px-4 py-4 text-lg font-bold">Home</p>
            <div class="flex flex-col px-4 space-y-4 lg:space-y-2">
              {#each leagues as league}
                <div class={`${expandedLeagues[league.id] ? `bg-BrandPurple` : `bg-BrandLightGray` } rounded shadow ${expandedLeagues[league.id] ? 'md:mb-0' : ''}`}>
                  <button
                    type="button"
                    class="flex items-center justify-between w-full px-4 py-2 text-left bg-transparent border-0 cursor-pointer md:py-3"
                    on:click={() => toggleLeague(league.id)}
                  >
                    <p class="text-sm font-medium md:text-base">{league.name}</p>
                    {#if expandedLeagues[league.id]}
                      <ArrowUp className="w-5 h-5 text-gray-600" />
                    {:else}
                      <ArrowDown className="w-5 h-5 text-gray-600" />
                    {/if}
                  </button>

                  {#if expandedLeagues[league.id] && !loadingFixtures[league.id]}
                    <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                      <div class="flex flex-row w-full font-bold text-black bg-white">
                        <div class="flex items-center justify-center w-5/12 py-2 md:py-3 md:w-5/12">
                          <button class="text-gray-500 hover:text-gray-700">
                            <span class="text-sm md:text-[12px] lg:text-base">&larr;</span>
                          </button>
                          <div class="mx-2 sm:mx-3 md:mx-2 lg:mx-4">
                            <span class="text-[10px] tracking-wider uppercase sm:text-xs md:text-xs lg:text-sm whitespace-nowrap text-center">
                              Gameweek <span class="inline md:block md:text-center lg:inline">12</span>
                            </span>
                          </div>
                          <button class="text-gray-500 hover:text-gray-700">
                            <span class="text-sm md:text-[12px] lg:text-base">&rarr;</span>
                          </button>
                        </div>
                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">Home</div>
                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">Draw</div>
                        <div class="flex items-center justify-center w-2/12 text-[10px] sm:text-xs md:text-xs lg:text-sm">Away</div>
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
                          {@const odds = bettingFixtureDTOs[league.id].find((odds) => odds.fixtureId === fixture.id)}
                          {#if odds}
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
                                      <span class="text-xs truncate md:text-base">{leagueClubs[league.id]?.[fixture.homeClubId]?.name || "Unknown"}</span>
                                    </div>
                                    <div class="flex items-center space-x-2 md:space-x-3">
                                      <BadgeIcon
                                        primaryColour={leagueClubs[league.id]?.[fixture.awayClubId]?.primaryColourHex}
                                        secondaryColour={leagueClubs[league.id]?.[fixture.awayClubId]?.secondaryColourHex}
                                        thirdColour={leagueClubs[league.id]?.[fixture.awayClubId]?.thirdColourHex}
                                        className="flex-shrink-0 w-4 md:w-6"
                                      />
                                      <span class="text-xs truncate md:text-base">{leagueClubs[league.id]?.[fixture.awayClubId]?.name || "Unknown"}</span>
                                    </div>
                                    <span class="mt-1 text-[10px] md:text-xs text-gray-400">{convertDateToReadable(Number(fixture.kickOff))}</span>
                                  </div>
                                </div>

                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button 
                                    class="flex items-center justify-center gap-2 p-2 text-xs rounded md:text-base hover:bg-BrandGray/80 transition-colors duration-200 {isBetSelected(odds?.homeOdds || 0, `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} to Win`) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => {
                                      const description = `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} to Win`;
                                      const currentOdds = odds?.homeOdds || 0;
                                      
                                      if (isBetSelected(currentOdds, description)) {
                                          delete selectedOdds[description];
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = selectedBets.filter(bet => 
                                              !(bet.odds === currentOdds && bet.description === description)
                                          );
                                      } else {
                                          selectedOdds[description] = currentOdds;
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = [...selectedBets, {
                                              type: 'home',
                                              odds: odds?.homeOdds || 0,
                                              description: `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} to Win`,
                                              homeClub: leagueClubs[league.id]?.[fixture.homeClubId],
                                              awayClub: leagueClubs[league.id]?.[fixture.awayClubId],
                                              category: 'correctResults'
                                          }];
                                      }
                                    }}
                                  >
                                    <span>{odds?.homeOdds?.toFixed(2) || "N/A"}</span>
                                    {#if isBetSelected(odds?.homeOdds || 0, `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} to Win`)}
                                        <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                    {/if}
                                  </button>
                                </div>
                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button 
                                    class="flex items-center justify-center gap-2 p-2 text-xs rounded md:text-base hover:bg-BrandGray/80 transition-colors duration-200 {isBetSelected(odds?.drawOdds || 0, `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} vs ${leagueClubs[league.id]?.[fixture.awayClubId]?.name} - Draw`) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => {
                                      const description = `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} vs ${leagueClubs[league.id]?.[fixture.awayClubId]?.name} - Draw`;
                                      const currentOdds = odds?.drawOdds || 0;
                                      
                                      if (isBetSelected(currentOdds, description)) {
                                          delete selectedOdds[description];
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = selectedBets.filter(bet => 
                                              !(bet.odds === currentOdds && bet.description === description)
                                          );
                                      } else {
                                          selectedOdds[description] = currentOdds;
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = [...selectedBets, {
                                              type: 'draw',
                                              odds: odds?.drawOdds || 0,
                                              description: description,
                                              homeClub: leagueClubs[league.id]?.[fixture.homeClubId],
                                              awayClub: leagueClubs[league.id]?.[fixture.awayClubId],
                                              category: 'correctResults'
                                          }];
                                      }
                                    }}
                                  >
                                    <span>{odds?.drawOdds?.toFixed(2) || "N/A"}</span>
                                    {#if isBetSelected(odds?.drawOdds || 0, `${leagueClubs[league.id]?.[fixture.homeClubId]?.name} vs ${leagueClubs[league.id]?.[fixture.awayClubId]?.name} - Draw`)}
                                        <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                    {/if}
                                  </button>
                                </div>
                                <div class="flex items-center justify-center h-full col-span-2">
                                  <button 
                                    class="flex items-center justify-center gap-2 p-2 text-xs rounded md:text-base hover:bg-BrandGray/80 transition-colors duration-200 {isBetSelected(odds?.awayOdds || 0, `${leagueClubs[league.id]?.[fixture.awayClubId]?.name} to Win`) ? 'bg-BrandGray/60' : ''}"
                                    on:click={() => {
                                      const description = `${leagueClubs[league.id]?.[fixture.awayClubId]?.name} to Win`;
                                      const currentOdds = odds?.awayOdds || 0;
                                      
                                      if (isBetSelected(currentOdds, description)) {
                                          delete selectedOdds[description];
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = selectedBets.filter(bet => 
                                              !(bet.odds === currentOdds && bet.description === description)
                                          );
                                      } else {
                                          selectedOdds[description] = currentOdds;
                                          selectedOdds = { ...selectedOdds }; // Force reactivity update
                                          selectedBets = [...selectedBets, {
                                              type: 'away',
                                              odds: odds?.awayOdds || 0,
                                              description: `${leagueClubs[league.id]?.[fixture.awayClubId]?.name} to Win`,
                                              homeClub: leagueClubs[league.id]?.[fixture.homeClubId],
                                              awayClub: leagueClubs[league.id]?.[fixture.awayClubId],
                                              category: 'correctResults'
                                          }];
                                      }
                                    }}
                                  >
                                    <span>{odds?.awayOdds?.toFixed(2) || "N/A"}</span>
                                    {#if isBetSelected(odds?.awayOdds || 0, `${leagueClubs[league.id]?.[fixture.awayClubId]?.name} to Win`)}
                                        <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
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

                  {#if loadingFixtures[league.id]}
                    <div class="px-4 py-2 space-y-2 text-sm bg-BrandDarkGray">
                      <LocalSpinner />
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
    
    <div class="flex-shrink-0 lg:ml-4 lg:w-80">
      <div class="hidden lg:block lg:sticky lg:top-4">
        <Betslip 
            {selectedBets} 
            onBetsUpdate={(updatedBets) => {
                selectedBets = updatedBets;
                Object.keys(selectedOdds).forEach(description => {
                    if (!updatedBets.some(bet => bet.description === description)) {
                        delete selectedOdds[description];
                    }
                });
                selectedOdds = { ...selectedOdds }; // Force reactivity update
            }}
        />
      </div>
      <div class="fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl border-BrandOddsDivider bg-BrandGray lg:hidden {isBetSlipExpanded ? 'hidden' : ''} md:left-24 md:right-12">
        <div class="w-full p-4 bg-white rounded-2xl md:mx-0">
          <button 
            class="flex items-center w-full text-left"
            on:click={toggleBetSlip}
          >
            <div class="flex items-center">
              <span class="flex items-center justify-center w-12 h-10 mr-3 text-xl font-medium text-white rounded-full bg-BrandPurple">
                {selectedBets.length}
              </span>
              <span class="text-xl font-semibold text-black">Bet Slip</span>
            </div>
          </button>
        </div>
      </div>
      {#if isBetSlipExpanded}
        <div class="lg:hidden">
          <Betslip {selectedBets} bind:isExpanded={isBetSlipExpanded} />
        </div>
      {/if}
    </div>
  </div>
</Layout>
