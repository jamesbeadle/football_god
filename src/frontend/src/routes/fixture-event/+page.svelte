<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Layout from "../Layout.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import TableIcon from "$lib/icons/TableIcon.svelte";
    import OddsIcon from "$lib/icons/OddsIcon.svelte";
    import Betslip from "$lib/components/bettings/betslip.svelte";
    import ArrowUp from "$lib/icons/ArrowUp.svelte";
    import ArrowDown from "$lib/icons/ArrowDown.svelte";
    import BetSelectedIcon from "$lib/icons/BetSelectedIcon.svelte";
 
    import { playerStore } from "$lib/stores/player-store";
    import { bettingStore } from "$lib/stores/betting-store";
    import { betSlipStore } from "$lib/stores/bet-slip-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import {
      formatUnixDateToReadable,
      formatUnixTimeToTime
    } from "$lib/utils/helpers";
  
    import type {
      MatchOddsDTO,
      PlayerSelectionOdds,
      ScoreSelectionOdds,
      YesNoSelectionOdds,
      TeamSelectionOdds,
      MissPenaltyOdds,
      OverUnderSelectionOdds,
      HalfTimeFullTimeOdds,
      ResultAndYesNoSelectionOdds
    } from "../../../../declarations/backend/backend.did";
  
    import type {
      Category,
      SelectionDetail,
      ClubDTO,
      FixtureDTO,
      PlayerDTO,
      FootballLeagueDTO,
      ClubId
    } from "../../../../declarations/data_canister/data_canister.did";
    import { betSlipDataStore } from "$lib/stores/bet-slip-data-store";
    import { buildBetUiDescription } from "$lib/utils/buildBetUiDescription";
    import { leagueStore } from "$lib/stores/league-store";
    import { fixtureWithClubsStore } from "$lib/derived/fixtures-with-clubs.derived";
    import { storeManager } from "$lib/managers/store-manager";
  
    $: leagueId = Number($page.url.searchParams.get("leagueId"));
    $: fixtureId = Number($page.url.searchParams.get("fixtureId"));
  
    let isLoading = true;
    let activeTab = "All";
    let isBetSlipExpanded = false;
  
    let matchOdds: MatchOddsDTO;
    let players: PlayerDTO[] = [];
    let clubs: ClubDTO[] = [];
    let fixture: FixtureDTO;
    let homeClub: ClubDTO;
    let awayClub: ClubDTO;
    let league: FootballLeagueDTO;
  
    const categoryGroups = {
      Goals: ["goalsOverUnder", "correctScores", "halfTimeScores"],
      Player: [
        "anytimeScorers",
        "scoresBrace",
        "scoresHatTrick",
        "anytimeAssist",
        "penaltyMissers",
        "redCards",
        "yellowCards"
      ],
      Team: [
        "bothTeamsToScore",
        "bothTeamsToScoreAndWinner",
        "correctResults",
        "halfTimeFullTimeResult",
        "penaltyMissed"
      ],
      "Half Time": ["halfTimeFullTimeResult", "halfTimeScores"]
    } as const;
  
    const tabs = ["All", "Goals", "Player", "Team", "Half Time"];
  
    let expandedCategories = {
      anytimeAssist: false,
      anytimeScorers: false,
      bothTeamsToScore: false,
      bothTeamsToScoreAndWinner: false,
      correctResults: false,
      correctScores: false,
      firstAssisters: false,
      firstGoalscorers: false,
      goalsOverUnder: false,
      halfTimeFullTimeResult: false,
      halfTimeScores: false,
      lastAssist: false,
      lastGoalscorers: false,
      penaltyMissed: false,
      penaltyMissers: false,
      redCards: false,
      scoresBrace: false,
      scoresHatTrick: false,
      yellowCards: false
    } as Record<string, boolean>;
  
    $: bettingCategories =
      matchOdds
        ? (activeTab === "All"
            ? [
                "correctResults",
                "correctScores",
                "goalsOverUnder",
                "bothTeamsToScore",
                "bothTeamsToScoreAndWinner",
                "halfTimeScores",
                "halfTimeFullTimeResult",
                "anytimeScorers",
                "anytimeAssist",
                "scoresBrace",
                "scoresHatTrick",
                "yellowCards",
                "redCards",
                "penaltyMissed",
                "penaltyMissers"
              ].filter((key) => key in matchOdds)
            : categoryGroups[activeTab as keyof typeof categoryGroups]) as readonly (keyof MatchOddsDTO)[]
        : [];
  
    $: league = JSON.parse(decodeURIComponent($page.url.searchParams.get("league") || ""));
    $: fixture = JSON.parse(decodeURIComponent($page.url.searchParams.get("fixture") || ""));
    $: currentFixture = $fixtureWithClubsStore.find(f => f.id === fixtureId);
    $: homeClub = currentFixture?.homeClub ?? {
      id: 0,
      name: "Unknown",
      friendlyName: "Unknown",
      abbreviatedName: "UNK",
      primaryColourHex: "",
      secondaryColourHex: "",
      thirdColourHex: "",
      shirtType: { Filled: null },
      status: { Active: null }
    };
    $: awayClub = currentFixture?.awayClub ?? {
      id: 0,
      name: "Unknown", 
      friendlyName: "Unknown",
      abbreviatedName: "UNK",
      primaryColourHex: "",
      secondaryColourHex: "",
      thirdColourHex: "",
      shirtType: { Filled: null },
      status: { Active: null }
    };
  
    onMount(async () => {
      try {
        await storeManager.syncStores(leagueId);
        matchOdds = await bettingStore.getMatchOdds(leagueId, fixtureId);
        players = await playerStore.getPlayers(leagueId);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading = false;
      }
    });
  
    function setActiveTab(tab: string) {
      activeTab = tab;
    }
  
    function toggleCategory(cat: string) {
      expandedCategories = {
        ...expandedCategories,
        [cat]: !expandedCategories[cat]
      };
    }
  
    function toggleBetSlip() {
      isBetSlipExpanded = !isBetSlipExpanded;
    }
  
    function mapCategoryKeyToCategory(key: string): Category {
      switch (key) {
        case "anytimeScorers":
          return { AnytimeGoalscorer: null };
        case "anytimeAssist":
          return { AnytimeAssist: null };
        case "bothTeamsToScore":
          return { BothTeamsToScore: null };
        case "bothTeamsToScoreAndWinner":
          return { BothTeamsToScoreAndWinner: null };
        case "scoresBrace":
          return { ScoreBrace: null };
        case "scoresHatTrick":
          return { ScoreHatrick: null };
        case "correctResults":
          return { CorrectResult: null };
        case "correctScores":
          return { CorrectScore: null };
        case "halfTimeFullTimeResult":
          return { HalfTimeFullTimeResult: null };
        case "penaltyMissed":
          return { PenaltyMissed: null };
        case "penaltyMissers":
          return { MissPenalty: null };
        case "redCards":
          return { RedCard: null };
        case "yellowCards":
          return { YellowCard: null };
        case "halfTimeScores":
          return { HalfTimeScore: null };
        case "goalsOverUnder":
          return { AnyCategoryForGoalsOverUnder: null } as unknown as Category;
        default:
          return { CorrectResult: null };
      }
    }
  
   
    export function buildSelectionDetail(categoryKey: string, data: any): SelectionDetail {
      switch (categoryKey) {
        case "anytimeScorers":
          return {
            AnytimeGoalscorer: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "anytimeAssist":
          return {
            AnytimeAssist: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "firstGoalscorer":
          return {
            FirstGoalscorer: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "lastGoalscorer":
          return {
            LastGoalscorer: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "missPenalty":
          return {
            MissPenalty: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "redCards":
          return {
            RedCard: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "yellowCards":
          return {
            YellowCard: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "firstAssist":
          return {
            FirstAssist: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "lastAssist":
          return {
            LastAssist: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };
        case "scoresBrace":
          return {
            ScoreBrace: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "scoresHatTrick":
          return {
            ScoreHatrick: {
              playerId: data.playerId,
              clubId: data.clubId,
            },
          };

        case "penaltyMissed":
          return {
            PenaltyMissed: {
              clubId: data.clubId,
            },
          };

        case "correctScores":
          return {
            CorrectScore: {
              homeGoals: data.homeGoals,
              awayGoals: data.awayGoals,
            },
          };

        case "halfTimeScores":
          return {
            HalfTimeScore: {
              homeGoals: data.homeGoals,
              awayGoals: data.awayGoals,
            },
          };

        case "correctResults":
          return {
            CorrectResult: {
              matchResult: data.matchResult,
            },
          };

        case "bothTeamsToScore":
          return {
            BothTeamsToScore: {
              bothTeamsToScore: data.isYes,
            },
          };

        case "bothTeamsToScoreAndWinner":
          return {
            BothTeamsToScoreAndWinner: {
              bothTeamsToScore: data.isYes,
              matchResult: data.result,
            },
          };

        case "halfTimeFullTimeResult":
          return {
            HalfTimeFullTimeResult: {
              halfTimeResult: data.halfTime,
              fullTimeResult: data.fullTime,
            },
          };

        case "goalsOverUnder":
          return {
            AnyCategoryForGoalsOverUnder: {
              margin: data.margin,
              isOver: data.isOver,
            } as unknown,
          } as unknown as SelectionDetail;

        default:
          return {
            CorrectResult: {
              matchResult: { Draw: null },
            },
          };
      }
    }

  
        
    function toggleBet(
      fixtureId: number,
      categoryKey: string,
      dataForDetail: any,
      displayedOdds: number
    ) {
      const category = mapCategoryKeyToCategory(categoryKey);
      const detail = buildSelectionDetail(categoryKey, dataForDetail);

      const isAlreadySelected = betSlipStore.isSelected(
        leagueId,
        fixtureId,
        category,
        detail
      );
      
      if (isAlreadySelected) {
        betSlipStore.removeBet(leagueId, fixtureId, category, detail);
        return;
      }
      
      betSlipDataStore.ensureLeagueData(leagueId).then(({ clubs, players }) => {
        
        const description = buildBetUiDescription(detail, clubs, players);

        betSlipStore.addBet({
          leagueId,
          fixtureId,
          status: { Unsettled: null },
          result: { Open: null },
          selectionType: category,
          selectionDetail: detail,
          odds: displayedOdds || 0,
          stake: 0n,
          winnings: 0,
          expectedReturns: 0n,
          uiDescription: description,
        });
      });
    }
  
    function isBetSelectedByData(fixtureId: number, categoryKey: string, dataForDetail: any) {
      const catObject = mapCategoryKeyToCategory(categoryKey);
      const detail = buildSelectionDetail(categoryKey, dataForDetail);
      return betSlipStore.isSelected(leagueId, fixtureId, catObject, detail);
    }
  
    function getOddDisplayText(
      odd:
        | number
        | PlayerSelectionOdds
        | ScoreSelectionOdds
        | YesNoSelectionOdds
        | TeamSelectionOdds
        | MissPenaltyOdds
        | OverUnderSelectionOdds
        | HalfTimeFullTimeOdds
        | ResultAndYesNoSelectionOdds
    ): string {
      if (typeof odd === "number") return odd.toString();
      if ("playerId" in odd) {
        const player = players.find((x) => x.id === odd.playerId);
        return player ? `${player.firstName} ${player.lastName}` : "N/A";
      }
      if ("clubId" in odd) {
        const club = clubs.find((x) => x.id === odd.clubId);
        return club ? `${club.friendlyName}` : "N/A";
      }
      if ("odds" in odd) {
        return `Odds: ${odd.odds}`;
      }
      return "Odds Item";
    }
  
    function getOddValue(
      odd:
        | number
        | PlayerSelectionOdds
        | ScoreSelectionOdds
        | YesNoSelectionOdds
        | TeamSelectionOdds
        | MissPenaltyOdds
        | OverUnderSelectionOdds
        | HalfTimeFullTimeOdds
        | ResultAndYesNoSelectionOdds
    ): number {
      if (typeof odd === "number") return odd;
      if ("odds" in odd) return odd.odds;
      return 0;
    }
  
    function sortByLowestOdds(a: any, b: any): number {
      return getOddValue(a) - getOddValue(b);
    }
  
    function formatOdds(odds: number) {
      return odds.toFixed(2);
    }
  
    function getScoresByResult(scores: ScoreSelectionOdds[], result: "draw" | "home" | "away") {
      if (!Array.isArray(scores)) return [];
      return scores.filter((s) => {
        switch (result) {
          case "draw":
            return s.homeGoals === s.awayGoals;
          case "home":
            return s.homeGoals > s.awayGoals;
          case "away":
            return s.homeGoals < s.awayGoals;
        }
      });
    }
  
    function addToBetslip(score: ScoreSelectionOdds) {
      toggleBet(fixtureId, "correctScores", score, score.odds);
    }
  
    function formatCategoryName(category: string) {
      if (category === "anytimeScorers") return "Goalscorers";
      if (category === "anytimeAssist") return "Assists";
      return category
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    function getOddsForCategory(category: keyof MatchOddsDTO) {
        if (!matchOdds) return [];
        
        const odds = matchOdds[category];
        if (!odds) return [];
        
        return Array.isArray(odds) ? odds : [odds];
    }

    function sortPlayersByTeamAndValue(
      players: PlayerDTO[],
      homeClubId: ClubId,
      awayClubId: ClubId
    ): PlayerDTO[] {
      return players.sort((a, b) => {
        if (a.clubId === homeClubId && b.clubId !== homeClubId) {
          return -1;
        }
        if (b.clubId === homeClubId && a.clubId !== homeClubId) {
          return 1;
        }

        if (a.clubId === awayClubId && b.clubId !== awayClubId) {
          return -1;
        }
        if (b.clubId === awayClubId && a.clubId !== awayClubId) {
          return 1;
        }

        return b.valueQuarterMillions - a.valueQuarterMillions;
      });
    }

    async function loadFixtureData(fixtureId: number, leagueId: number) {
      // First try URL params
      const urlParams = new URLSearchParams(window.location.search);
      const fixtureParam = urlParams.get('fixture');
      const leagueParam = urlParams.get('league');
      
      if (fixtureParam && leagueParam) {
        return {
          fixture: JSON.parse(decodeURIComponent(fixtureParam)),
          league: JSON.parse(decodeURIComponent(leagueParam))
        };
      }

      // If not in URL, try localStorage
      const storedFixture = localStorage.getItem(`fixture_event_${fixtureId}`);
      const storedLeague = localStorage.getItem(`fixture_event_league_${leagueId}`);
      
      if (storedFixture && storedLeague) {
        return {
          fixture: JSON.parse(storedFixture),
          league: JSON.parse(storedLeague)
        };
      }

      // If not in localStorage, fetch from service
      const fixture = await fixtureStore.getFixtures(leagueId)
        .then(fixtures => fixtures.find(f => f.id === fixtureId));
      const league = await leagueStore.getLeagueById(leagueId);

      if (!fixture || !league) {
        throw new Error('Fixture or league not found');
      }

      return { fixture, league };
    }

  </script>
  
  <Layout>
    <div class="flex flex-col md:flex-row">
      <div class="flex-1 md:block">
        {#if isLoading}
          <FullScreenSpinner />
        {:else}
          <div class="page-panel">
            <div class="page-panel-header">
              <a href="/" class="hover:text-white">Home</a>
              <span class="text-BrandPurple">></span>
              <span class="text-white">{homeClub.name} v {awayClub.name}</span>
            </div>
  
            <div class="p-6 rounded-lg bg-BrandPanelGray">
              <div class="flex flex-col items-center space-y-4">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center justify-center flex-1 space-x-4">
                    <span class="text-xl font-medium">{homeClub.name}</span>
                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-BrandGray">
                        <BadgeIcon
                          primaryColour={homeClub.primaryColourHex}
                          secondaryColour={homeClub.secondaryColourHex}
                          thirdColour={homeClub.thirdColourHex}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                    <span class="text-xl text-BrandTextGray">v</span>
                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-BrandGray">
                        <BadgeIcon
                          primaryColour={awayClub.primaryColourHex}
                          secondaryColour={awayClub.secondaryColourHex}
                          thirdColour={awayClub.thirdColourHex}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                    <span class="text-xl font-medium">{awayClub.name}</span>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex flex-col items-center">
                      <TableIcon className="w-5 h-5" />
                      <span class="mt-1 text-xs text-BrandTextGray">Table</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <OddsIcon className="w-5 h-5" fill="#919191" />
                      <span class="mt-1 text-xs text-BrandTextGray">Stats</span>
                    </div>
                  </div>
                </div>
                <div class="text-center text-BrandTextGray">
                  {formatUnixDateToReadable(Number(fixture.kickOff))}{" "}
                  {formatUnixTimeToTime(Number(fixture.kickOff))}
                </div>
              </div>
            </div>
  
            <div class="flex space-x-2 overflow-x-auto">
              {#each tabs as tab}
                <button
                  class="
                    px-4 py-2 rounded-xl whitespace-nowrap
                    {activeTab === tab
                      ? 'bg-BrandPurple text-white'
                      : 'bg-BrandGray border border-BrandOddsDivider text-gray-400 hover:bg-BrandGray/80'}
                  "
                  on:click={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              {/each}
            </div>
  
            <div class="space-y-4">
              {#each bettingCategories as category}
                <div
                  class="
                    {expandedCategories[category]
                      ? 'bg-BrandPurple'
                      : 'bg-BrandPanelGray'}
                    rounded shadow
                  "
                >
                  <button
                    type="button"
                    class="flex items-center justify-between w-full px-4 py-3 text-left bg-transparent border-0 cursor-pointer"
                    on:click={() => toggleCategory(category)}
                  >
                    <h3 class="text-lg font-semibold">{formatCategoryName(category)}</h3>
                    {#if expandedCategories[category]}
                      <ArrowUp className="w-5 h-5 text-white" />
                    {:else}
                      <ArrowDown className="w-5 h-5 text-white" />
                    {/if}
                  </button>
  
                  {#if expandedCategories[category]}
                    {#if category === "correctScores" || category === "halfTimeScores"}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-3 font-bold text-center text-black bg-white">
                          <div class="p-2">Home</div>
                          <div class="p-2">Draw</div>
                          <div class="p-2">Away</div>
                        </div>
                        <div class="grid grid-cols-3 gap-4 p-4">
                          <div class="space-y-2">
                            {#each getScoresByResult(matchOdds[category], "home").sort(sortByLowestOdds) as score}
                              <button
                                class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => addToBetslip(score)}
                              >
                                <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                <div class="flex items-center space-x-2">
                                  <span class="text-base">{formatOdds(score.odds)}</span>
                                  {#if isBetSelectedByData(fixtureId, "correctScores", score)}
                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                  {/if}
                                </div>
                              </button>
                            {/each}
                          </div>
  
                          <div class="space-y-2">
                            {#each getScoresByResult(matchOdds[category], "draw").sort(sortByLowestOdds) as score}
                              <button
                                class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => addToBetslip(score)}
                              >
                                <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                <div class="flex items-center space-x-2">
                                  <span class="text-base">{formatOdds(score.odds)}</span>
                                  {#if isBetSelectedByData(fixtureId, "correctScores", score)}
                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                  {/if}
                                </div>
                              </button>
                            {/each}
                          </div>
  
                          <div class="space-y-2">
                            {#each getScoresByResult(matchOdds[category], "away").sort(sortByLowestOdds) as score}
                              <button
                                class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => addToBetslip(score)}
                              >
                                <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                <div class="flex items-center space-x-2">
                                  <span class="text-base">{formatOdds(score.odds)}</span>
                                  {#if isBetSelectedByData(fixtureId, "correctScores", score)}
                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                  {/if}
                                </div>
                              </button>
                            {/each}
                          </div>
                        </div>
                      </div>
  
                    {:else if category === "anytimeScorers" }
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                          <div class="p-2">Player</div>
                          <div class="p-2">First</div>
                          <div class="p-2">Last</div>
                          <div class="p-2">Anytime</div>
                        </div>
  
                        {#each sortPlayersByTeamAndValue(players, homeClub.id, awayClub.id) as player}
                          {@const firstGoal = matchOdds.firstGoalscorers?.find((x) => x.playerId === player.id)}
                          {@const lastGoal = matchOdds.lastGoalscorers?.find((x) => x.playerId === player.id)}
                          {@const anytimeGoal = matchOdds.anytimeScorers?.find((x) => x.playerId === player.id)}
  
                          {#if firstGoal || lastGoal || anytimeGoal}
                            <div class="grid grid-cols-4 text-center">
                              <div class="p-4 text-base text-left border-b border-x border-BrandGray bg-BrandLightGray">
                                {player.firstName} {player.lastName}
                              </div>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (firstGoal) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "first" },
                                      firstGoal.odds
                                    );
                                  }
                                }}
                              >
                                {firstGoal ? formatOdds(firstGoal.odds) : "N/A"}
                                {#if firstGoal && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "first" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (lastGoal) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "last" },
                                      lastGoal.odds
                                    );
                                  }
                                }}
                              >
                                {lastGoal ? formatOdds(lastGoal.odds) : "N/A"}
                                {#if lastGoal && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "last" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (anytimeGoal) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "anytime" },
                                      anytimeGoal.odds
                                    );
                                  }
                                }}
                              >
                                {anytimeGoal ? formatOdds(anytimeGoal.odds) : "N/A"}
                                {#if anytimeGoal && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "anytime" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                            </div>
                          {/if}
                        {/each}
                      </div>
                      {:else if category === "anytimeAssist"}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                          <div class="p-2">Player</div>
                          <div class="p-2">First</div>
                          <div class="p-2">Last</div>
                          <div class="p-2">Anytime</div>
                        </div>
  
                        {#each sortPlayersByTeamAndValue(players, homeClub.id, awayClub.id) as player}
                          {@const firstAssist = matchOdds.firstAssisters?.find((x) => x.playerId === player.id)}
                          {@const lastAssist = matchOdds.lastAssist?.find((x) => x.playerId === player.id)}
                          {@const anytimeAssist = matchOdds.anytimeAssist?.find((x) => x.playerId === player.id)}
  
                          {#if firstAssist || lastAssist || anytimeAssist}
                            <div class="grid grid-cols-4 text-center">
                              <div class="p-4 text-base text-left border-b border-x border-BrandGray bg-BrandLightGray">
                                {player.firstName} {player.lastName}
                              </div>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (firstAssist) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "first" },
                                      firstAssist.odds
                                    );
                                  }
                                }}
                              >
                                {firstAssist ? formatOdds(firstAssist.odds) : "N/A"}
                                {#if firstAssist && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "first" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (lastAssist) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "last" },
                                      lastAssist.odds
                                    );
                                  }
                                }}
                              >
                                {lastAssist ? formatOdds(lastAssist.odds) : "N/A"}
                                {#if lastAssist && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "last" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                on:click={() => {
                                  if (anytimeAssist) {
                                    toggleBet(
                                      fixtureId,
                                      category,
                                      { playerId: player.id, timing: "anytime" },
                                      anytimeAssist.odds
                                    );
                                  }
                                }}
                              >
                                {anytimeAssist ? formatOdds(anytimeAssist.odds) : "N/A"}
                                {#if anytimeAssist && isBetSelectedByData(fixtureId, category, { playerId: player.id, timing: "anytime" })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                            </div>
                          {/if}
                        {/each}
                      </div>

                    {:else if ["scoresBrace"].includes(category)}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                          <div class="col-span-3 p-2">Selection</div>
                          <div class="p-2">Odds</div>
                        </div>
                        <div class="divide-y divide-BrandOddsDivider">
                          {#each getOddsForCategory(category).sort(sortByLowestOdds) as odd}
                            <div class="grid grid-cols-4">
                              <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                {getOddDisplayText(odd)}
                              </div>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => {
                                  toggleBet(
                                    fixtureId,
                                    category,
                                    odd, //TODO: Need to pass object not odd
                                    getOddValue(odd)
                                  );
                                }}
                              >
                                <span>{formatOdds(getOddValue(odd))}</span>
                                {#if isBetSelectedByData(fixtureId, category, odd)}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                            </div>
                          {/each}
                        </div>
                      </div>

  
                    {:else if ["yellowCards", "redCards", "penaltyMissers", "scoresHatTrick", "halfTimeFullTimeResult", "bothTeamsToScoreAndWinner"].includes(category)}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                          <div class="col-span-3 p-2">Selection</div>
                          <div class="p-2">Odds</div>
                        </div>
                        <div class="divide-y divide-BrandOddsDivider">
                          {#each getOddsForCategory(category).sort(sortByLowestOdds) as odd}
                            <div class="grid grid-cols-4">
                              <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                {getOddDisplayText(odd)}
                              </div>
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => {
                                  toggleBet(
                                    fixtureId,
                                    category,
                                    odd,
                                    getOddValue(odd)
                                  );
                                }}
                              >
                                <span>{formatOdds(getOddValue(odd))}</span>
                                {#if isBetSelectedByData(fixtureId, category, odd)}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                            </div>
                          {/each}
                        </div>
                      </div>
  
                    {:else if category === "bothTeamsToScore"}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                          <div class="col-span-3 p-2"></div>
                          <div class="p-2">Odds</div>
                        </div>
                        <div class="divide-y divide-BrandOddsDivider">
                          <div class="grid grid-cols-4">
                            <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">Yes</div>
                            <button
                              class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                              on:click={() => {
                                toggleBet(
                                  fixtureId,
                                  "bothTeamsToScore",
                                  { isYes: true },
                                  matchOdds.bothTeamsToScore.yesOdds
                                );
                              }}
                            >
                              <span>{formatOdds(matchOdds.bothTeamsToScore.yesOdds)}</span>
                              {#if isBetSelectedByData(fixtureId, "bothTeamsToScore", { isYes: true })}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </button>
                          </div>
  
                          <div class="grid grid-cols-4">
                            <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">No</div>
                            <button
                              class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                              on:click={() => {
                                toggleBet(
                                  fixtureId,
                                  "bothTeamsToScore",
                                  { isYes: false },
                                  matchOdds.bothTeamsToScore.noOdds
                                );
                              }}
                            >
                              <span>{formatOdds(matchOdds.bothTeamsToScore.noOdds)}</span>
                              {#if isBetSelectedByData(fixtureId, "bothTeamsToScore", { isYes: false })}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </button>
                          </div>
                        </div>
                      </div>
  
                    {:else if category === "goalsOverUnder"}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-3 font-bold text-center text-black bg-white">
                          <div class="p-2">Goals</div>
                          <div class="p-2">Over</div>
                          <div class="p-2">Under</div>
                        </div>
                        <div class="divide-y divide-BrandOddsDivider">
                          {#each matchOdds.goalsOverUnder.overOdds.sort(sortByLowestOdds) as overItem}
                            <div class="grid grid-cols-3">
                              <div class="p-4 text-base text-center bg-BrandLightGray">
                                {overItem.margin}
                              </div>
  
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => {
                                  toggleBet(
                                    fixtureId,
                                    "goalsOverUnder",
                                    { margin: overItem.margin, isOver: true },
                                    overItem.odds
                                  );
                                }}
                              >
                                <span>{formatOdds(overItem.odds)}</span>
                                {#if isBetSelectedByData(fixtureId, "goalsOverUnder", { margin: overItem.margin, isOver: true })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
  
                              <button
                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                on:click={() => {
                                  const underObj = matchOdds.goalsOverUnder.underOdds.find((x) => x.margin === overItem.margin);
                                  if (underObj) {
                                    toggleBet(
                                      fixtureId,
                                      "goalsOverUnder",
                                      { margin: underObj.margin, isOver: false },
                                      underObj.odds
                                    );
                                  }
                                }}
                              >
                                <span>
                                  {formatOdds(
                                    matchOdds.goalsOverUnder.underOdds.find((x) => x.margin === overItem.margin)?.odds ?? 0
                                  )}
                                </span>
                                {#if isBetSelectedByData(fixtureId, "goalsOverUnder", { margin: overItem.margin, isOver: false })}
                                  <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                {/if}
                              </button>
                            </div>
                          {/each}
                        </div>
                      </div>
  
                    {:else if category === "correctResults"}
                      <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                        <div class="grid grid-cols-3 font-bold text-center text-black bg-white">
                          <div class="p-2">{homeClub.name}</div>
                          <div class="p-2">Draw</div>
                          <div class="p-2">{awayClub.name}</div>
                        </div>
                        <div class="grid grid-cols-3 p-4">
                          <button
                            class="flex flex-col items-center justify-center p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                            on:click={() => {
                              toggleBet(
                                fixtureId,
                                "correctResults",
                                { matchResult: { HomeWin: null } },
                                matchOdds.correctResults.homeOdds
                              );
                            }}
                          >
                            <span class="mb-2 font-medium">Win</span>
                            <div class="flex items-center gap-2">
                              <span class="text-xl">{formatOdds(matchOdds.correctResults.homeOdds)}</span>
                              {#if isBetSelectedByData(fixtureId, "correctResults", { matchResult: { HomeWin: null } })}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </div>
                          </button>
  
                          <button
                            class="flex flex-col items-center justify-center p-4 mx-2 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                            on:click={() => {
                              toggleBet(
                                fixtureId,
                                "correctResults",
                                { matchResult: { Draw: null } },
                                matchOdds.correctResults.drawOdds
                              );
                            }}
                          >
                            <span class="mb-2 font-medium">Draw</span>
                            <div class="flex items-center gap-2">
                              <span class="text-xl">{formatOdds(matchOdds.correctResults.drawOdds)}</span>
                              {#if isBetSelectedByData(fixtureId, "correctResults", { matchResult: { Draw: null } })}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </div>
                          </button>
  
                          <button
                            class="flex flex-col items-center justify-center p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                            on:click={() => {
                              toggleBet(
                                fixtureId,
                                "correctResults",
                                { matchResult: { AwayWin: null } },
                                matchOdds.correctResults.awayOdds
                              );
                            }}
                          >
                            <span class="mb-2 font-medium">Win</span>
                            <div class="flex items-center gap-2">
                              <span class="text-xl">{formatOdds(matchOdds.correctResults.awayOdds)}</span>
                              {#if isBetSelectedByData(fixtureId, "correctResults", { matchResult: { AwayWin: null } })}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </div>
                          </button>
                        </div>
                      </div>
  
                    {:else}
                      <div class="p-4">
                        {#each getOddsForCategory(category).sort(sortByLowestOdds) as odd}
                          <div class="flex items-center justify-between py-2 border-b border-BrandOddsDivider last:border-b-0">
                            <span class="text-white">{getOddDisplayText(odd)}</span>
                            <button
                              class="flex items-center justify-center gap-2 px-4 py-2 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                              on:click={() => {
                                toggleBet(
                                  fixtureId,
                                  category,
                                  odd,
                                  getOddValue(odd)
                                );
                              }}
                            >
                              {formatOdds(getOddValue(odd))}
                              {#if isBetSelectedByData(fixtureId, category, odd)}
                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                              {/if}
                            </button>
                          </div>
                        {/each}
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
            leagueData={{ [league.id]: league }}
            fixtureData={{ [fixture.id]: { ...fixture, leagueId: league.id } }}
          />
        </div>
  
        <div
          class="
            fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl border-BrandOddsDivider bg-BrandGray 
            lg:hidden
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
              leagueData={{ [league.id]: league }}
              fixtureData={{ [fixture.id]: { ...fixture, leagueId: league.id } }}
            />
          </div>
        {/if}
      </div>
    </div>
  </Layout>
  