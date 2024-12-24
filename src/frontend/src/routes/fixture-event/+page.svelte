<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import type { ClubDTO, FixtureDTO, MatchOddsDTO, PlayerDTO, 
        PlayerSelectionOdds,
        ScoreSelectionOdds,
        YesNoSelectionOdds,
        TeamSelectionOdds,
        MissPenaltyOdds,
        OverUnderSelectionOdds,
        HalfTimeFullTimeOdds,
        ResultAndYesNoSelectionOdds,
    } from "../../../../declarations/backend/backend.did";
    import Layout from "../Layout.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import { bettingStore } from "$lib/stores/betting-store";
    import { playerStore } from "$lib/stores/player-store";
    import { clubStore } from "$lib/stores/club-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import { formatUnixDateToReadable, formatUnixTimeToTime } from "$lib/utils/helpers";

    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import TableIcon from "$lib/icons/TableIcon.svelte";
    import OddsIcon from "$lib/icons/OddsIcon.svelte";
    import BetSelectedIcon from "$lib/icons/BetSelectedIcon.svelte";

    import Betslip from "$lib/components/shared/betslip.svelte";
    import ArrowDown from "$lib/icons/ArrowDown.svelte";
    import ArrowUp from "$lib/icons/ArrowUp.svelte";

    import type { BetSelection, BetType } from "$lib/types/betting";

    let isLoading = true;
    let activeTab = 'All';
    let yesSelected = false;
    let noSelected = false;
    let selectedOdds: Record<string, number> = {};

    $: leagueId = Number($page.url.searchParams.get("leagueId"));
    $: fixtureId = Number($page.url.searchParams.get("fixtureId"));
    let matchOdds: MatchOddsDTO;
    let players: PlayerDTO[];
    let fixture: FixtureDTO;
    let homeClub: ClubDTO;
    let awayClub: ClubDTO;

    const tabs = ['All', 'Goals', 'Player', 'Team', 'Half Time'];

    let selectedBets: BetSelection[] = []; 
    let isBetSlipExpanded = false;

    function toggleBetSlip() {
        isBetSlipExpanded = !isBetSlipExpanded;
    }

    onMount(async () => {
        try{
            yesSelected = false;
            noSelected = false;
            matchOdds = await bettingStore.getMatchOdds(leagueId, fixtureId);
            players = await playerStore.getPlayers(leagueId);
            let clubs = await clubStore.getClubs(leagueId);
            let fixtures = await fixtureStore.getFixtures(leagueId);
            fixture = fixtures.find(x => x.id == fixtureId)!;
            if(!fixture){
                return;
            }            
            homeClub = clubs.find(x => x.id == fixture.homeClubId)!;
            awayClub = clubs.find(x => x.id == fixture.awayClubId)!;
        } catch(error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    });

    const formatOdds = (odds: number) => odds.toFixed(2);

    function setActiveTab(tab: string) {
        activeTab = tab;
    }

    const categoryGroups = {
        'Goals': [
            'goalsOverUnder',
            'correctScores',
            'halfTimeScores'
        ],
        'Player': [
            'anytimeScorers',
            'scoresBrace',
            'scoresHatTrick',
            'anytimeAssist',
            'penaltyMissers',
            'redCards',
            'yellowCards'
        ],
        'Team': [
            'bothTeamsToScore',
            'bothTeamsToScoreAndWinner',
            'correctResults',
            'halfTimeFullTimeResult',
            'penaltyMissed'
        ],
        'Half Time': [
            'halfTimeFullTimeResult',
            'halfTimeScores'
        ]
    } as const;

    $: bettingCategories = matchOdds ? 
        (activeTab === 'All' 
            ? [
                'bothTeamsToScore',
                'bothTeamsToScoreAndWinner',
                'correctResults',
                'correctScores',
                'halfTimeScores',
                'halfTimeFullTimeResult',
                'goalsOverUnder',
                'anytimeScorers',
                'scoresBrace',
                'scoresHatTrick',
                'anytimeAssist',
                'penaltyMissed',
                'penaltyMissers',
                'redCards',
                'yellowCards'
            ].filter(key => key in matchOdds)
            : categoryGroups[activeTab as keyof typeof categoryGroups]
        ) as readonly (keyof MatchOddsDTO)[] 
        : [];


    function formatCategoryName(category: string): string {
        if (category === 'anytimeScorers') return 'Goalscorers';
        if (category === 'anytimeAssist') return 'Assists';
        
        return category
            .split(/(?=[A-Z])/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

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
    } as Record<keyof MatchOddsDTO, boolean>;

    type ScoreOdds = {
        homeGoals: number;
        awayGoals: number;
        odds: number;
    };

    let currentCategory: keyof MatchOddsDTO | null = null;

    function toggleCategory(cat: keyof MatchOddsDTO) {
        currentCategory = cat;
        expandedCategories = { 
            ...expandedCategories, 
            [cat]: !expandedCategories[cat] 
        };
    }

    function getOddsForCategory(category: keyof MatchOddsDTO) {
        if (!matchOdds) return [];
        
        const odds = matchOdds[category];
        if (!odds) return [];
        
        return Array.isArray(odds) ? odds : [odds];
    }

    function getOddDisplayText(odd: number | PlayerSelectionOdds | ScoreSelectionOdds | YesNoSelectionOdds | TeamSelectionOdds | MissPenaltyOdds | OverUnderSelectionOdds | HalfTimeFullTimeOdds | ResultAndYesNoSelectionOdds): string {
        if (typeof odd === 'number') return odd.toString();
        if ('playerId' in odd) {
            const player = players.find(x => x.id === odd.playerId);
            return player ? `${player.firstName} ${player.lastName}` : 'N/A';
        }
        if ('firstHalfResult' in odd && 'secondHalfResult' in odd) {
            const getResultText = (result: string) => {
                switch(result) {
                    case 'HomeWin': return homeClub.name;
                    case 'AwayWin': return awayClub.name;
                    case 'Draw': return 'Draw';
                    default: return result;
                }
            };
            const htResult = getResultText(Object.keys(odd.firstHalfResult)[0]);
            const ftResult = getResultText(Object.keys(odd.secondHalfResult)[0]);
            return `${htResult} at HT / ${ftResult} at FT`;
        }
        if ('result' in odd) {
            const result = odd.result;
            if (typeof result === 'string') return result;
            if ('HomeWin' in result) return 'Home Win';
            if ('Draw' in result) return 'Draw';
            if ('AwayWin' in result) return 'Away Win';
            return JSON.stringify(result);
        }
        if ('type' in odd) {
            if (typeof odd.type === 'string') return odd.type;
            return JSON.stringify(odd.type);
        }
        return 'N/A';
    }

    function getOddValue(odd: number | PlayerSelectionOdds | ScoreSelectionOdds | YesNoSelectionOdds | TeamSelectionOdds | MissPenaltyOdds | OverUnderSelectionOdds | HalfTimeFullTimeOdds | ResultAndYesNoSelectionOdds): number {
        if (typeof odd === 'number') return odd;
        if ('odds' in odd) return odd.odds;
        return 0;
    }

    function getScoresByResult(scores: ScoreOdds[], result: 'draw' | 'home' | 'away') {
        if (!Array.isArray(scores)) return [];
        
        return scores.filter(s => {
            switch(result) {
                case 'draw':
                    return s.homeGoals === s.awayGoals;
                case 'home':
                    return s.homeGoals > s.awayGoals;
                case 'away':
                    return s.homeGoals < s.awayGoals;
            }
        });
    }

    function addToBetslip(odd: any) {
        const bet: BetSelection = {
            homeClub,
            awayClub,
            odds: getOddValue(odd),
            type: getBetType(currentCategory),
            description: getOddDisplayText(odd),
            category: currentCategory || undefined
        };

        if ('homeGoals' in odd && 'awayGoals' in odd) {
            bet.score = `${odd.homeGoals}-${odd.awayGoals}`;
        }

        selectedBets = [...selectedBets, bet];
    }

    function getBetType(category: keyof MatchOddsDTO | null): BetSelection['type'] {
        if (!category) return 'home';  

        if (['yellowCards', 'redCards', 'penaltyMissers', 'scoresBrace', 'scoresHatTrick'].includes(category)) {
            return 'player';
        }
        if (['bothTeamsToScore', 'bothTeamsToScoreAndWinner', 'penaltyMissed'].includes(category)) {
            return 'team';
        }
        if (category === 'correctScores' || category === 'halfTimeScores') {
            return 'score';
        }
        if (category === 'halfTimeFullTimeResult') {
            return 'halftime-fulltime';
        }
        
        return 'home'; 
    }

    function sortByLowestOdds(a: any, b: any): number {
        const oddsA = getOddValue(a);
        const oddsB = getOddValue(b);
        return oddsA - oddsB;
    }

    function removeBetFromBetslip(bet: any) {
        selectedBets = selectedBets.filter(selectedBet => 
            !(selectedBet.odds === bet.odds && 
              selectedBet.description === bet.description)
        );
    }

    function isBetSelected(odds: number, description: string): boolean {
        return selectedOdds[description] === odds;
    }

    function toggleBetSelection(odds: number, description: string) {
        if (selectedOdds[description] === odds) {
            delete selectedOdds[description];
            removeBetFromBetslip({ odds, description });
        } else {
            selectedOdds[description] = odds;
            return true; 
        }
        return false; 
    }
</script>

<Layout>
    <div class="flex flex-col md:flex-row">
        <div class="flex-1 md:block">
            {#if isLoading}
                <FullScreenSpinner />
            {:else}
                <div class="flex flex-col p-4 space-y-4 text-white rounded-xl bg-BrandGray">
                    <div class="flex items-center space-x-2 text-base text-BrandTextGray2">
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
                                {formatUnixDateToReadable(Number(fixture.kickOff))} {formatUnixTimeToTime(Number(fixture.kickOff))}
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2 overflow-x-auto">
                        {#each tabs as tab}
                            <button 
                                class="px-4 py-2 rounded-xl whitespace-nowrap {activeTab === tab ? 'bg-BrandPurple text-white' : 'bg-BrandGray border border-BrandOddsDivider text-gray-400 hover:bg-BrandGray/80'}"
                                on:click={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        {/each}
                    </div>
                    <div class="space-y-4">
                        {#each bettingCategories as category}
                            <div class={`${expandedCategories[category] ? 'bg-BrandPurple' : 'bg-BrandPanelGray'} rounded shadow`}>
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
                                    {#if category === 'correctScores' || category === 'halfTimeScores'}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-3 font-bold text-center text-black bg-white">
                                                <div class="p-2">Home</div>
                                                <div class="p-2">Draw</div>
                                                <div class="p-2">Away</div>
                                            </div>
                                            <div class="grid grid-cols-3 gap-4 p-4">
                                                <div class="space-y-2">
                                                    {#each getScoresByResult(matchOdds[category], 'home').sort(sortByLowestOdds) as score}
                                                        <button 
                                                            class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => addToBetslip(score)}
                                                        >
                                                            <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                                            <div class="flex items-center space-x-2">
                                                                <span class="text-base">{score.odds.toFixed(2)}</span>
                                                                {#if selectedBets.some(bet => 
                                                                    bet.type === 'score' && 
                                                                    bet.score === `${score.homeGoals}-${score.awayGoals}`
                                                                )}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </div>
                                                        </button>
                                                    {/each}
                                                </div>
                                                <div class="space-y-2">
                                                    {#each getScoresByResult(matchOdds[category], 'draw').sort(sortByLowestOdds) as score}
                                                        <button 
                                                            class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => addToBetslip(score)}
                                                        >
                                                            <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                                            <div class="flex items-center space-x-2">
                                                                <span class="text-base">{score.odds.toFixed(2)}</span>
                                                                {#if selectedBets.some(bet => 
                                                                    bet.type === 'score' && 
                                                                    bet.score === `${score.homeGoals}-${score.awayGoals}`
                                                                )}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </div>
                                                        </button>
                                                    {/each}
                                                </div>
                                                <div class="space-y-2">
                                                    {#each getScoresByResult(matchOdds[category], 'away').sort(sortByLowestOdds) as score}
                                                        <button 
                                                            class="flex items-center justify-between w-full p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => addToBetslip(score)}
                                                        >
                                                            <span class="text-lg font-bold">{score.homeGoals}-{score.awayGoals}</span>
                                                            <div class="flex items-center space-x-2">
                                                                <span class="text-base">{score.odds.toFixed(2)}</span>
                                                                {#if selectedBets.some(bet => 
                                                                    bet.type === 'score' && 
                                                                    bet.score === `${score.homeGoals}-${score.awayGoals}`
                                                                )}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </div>
                                                        </button>
                                                    {/each}
                                                </div>
                                            </div>
                                        </div>
                                    {:else if category === 'anytimeScorers' || category === 'anytimeAssist'}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                                                <div class="p-2">Player</div>
                                                <div class="p-2">First</div>
                                                <div class="p-2">Last</div>
                                                <div class="p-2">Anytime</div>
                                            </div>
                                            {#each players as player}
                                                {@const firstAssist = matchOdds.firstAssisters?.find(x => x.playerId === player.id)}
                                                {@const lastAssist = matchOdds.lastAssist?.find(x => x.playerId === player.id)}
                                                {@const anytimeAssist = matchOdds.anytimeAssist?.find(x => x.playerId === player.id)}
                                                {#if firstAssist || lastAssist || anytimeAssist}
                                                    <div class="grid grid-cols-4 text-center">
                                                        <div class="p-4 text-base text-left border-b border-x border-BrandGray bg-BrandLightGray">
                                                            {player.firstName} {player.lastName}
                                                        </div>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                                            on:click={() => firstAssist && addToBetslip({ 
                                                                playerId: player.id,
                                                                odds: firstAssist.odds,
                                                                betType: 'player',
                                                                timing: 'first',
                                                                description: `First ${category === 'anytimeScorers' ? 'Goalscorer' : 'Assist'} - ${player.firstName} ${player.lastName}`
                                                            })}
                                                        >
                                                            {firstAssist?.odds.toFixed(2) || 'N/A'}
                                                            {#if selectedBets.some(bet => 
                                                                bet.type === 'player' && 
                                                                bet.odds === firstAssist?.odds
                                                            )}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                                            on:click={() => lastAssist && addToBetslip({ 
                                                                playerId: player.id,
                                                                odds: lastAssist.odds,
                                                                betType: 'player',
                                                                timing: 'last',
                                                                description: `Last ${category === 'anytimeScorers' ? 'Goalscorer' : 'Assist'} - ${player.firstName} ${player.lastName}`
                                                            })}
                                                        >
                                                            {lastAssist?.odds.toFixed(2) || 'N/A'}
                                                            {#if selectedBets.some(bet => 
                                                                bet.type === 'player' && 
                                                                bet.odds === lastAssist?.odds
                                                            )}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white border-b border-r bg-BrandGray border-BrandOddsDivider hover:bg-BrandGray/80"
                                                            on:click={() => anytimeAssist && addToBetslip({ 
                                                                playerId: player.id,
                                                                odds: anytimeAssist.odds,
                                                                betType: 'player',
                                                                timing: 'anytime',
                                                                description: `Anytime ${category === 'anytimeScorers' ? 'Goalscorer' : 'Assist'} - ${player.firstName} ${player.lastName}`
                                                            })}
                                                        >
                                                            {anytimeAssist?.odds.toFixed(2) || 'N/A'}
                                                            {#if selectedBets.some(bet => 
                                                                bet.type === 'player' && 
                                                                bet.odds === anytimeAssist?.odds
                                                            )}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                    </div>
                                                {/if}
                                            {/each}
                                        </div>
                                    {:else if ['yellowCards', 'redCards', 'penaltyMissers', 'scoresBrace', 'scoresHatTrick', 'halfTimeFullTimeResult', 'bothTeamsToScoreAndWinner'].includes(category)}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                                                <div class="col-span-3"></div>
                                                <div class="p-2">Odds</div>
                                            </div>
                                            <div class="divide-y divide-BrandOddsDivider">
                                                {#if category === 'bothTeamsToScoreAndWinner'}
                                                    {#each matchOdds.bothTeamsToScoreAndWinner.filter(x => x.isYes).sort(sortByLowestOdds) as bothTeamScorerAndWinner}
                                                        <div class="grid grid-cols-4">
                                                            <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                                                {Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                    ? homeClub.name 
                                                                    : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                    ? awayClub.name 
                                                                    : 'Draw'} {Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams Score
                                                            </div>
                                                            <button 
                                                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                                on:click={() => addToBetslip({ 
                                                                    result: bothTeamScorerAndWinner.result,
                                                                    bothTeamsScore: bothTeamScorerAndWinner.isYes,
                                                                    odds: bothTeamScorerAndWinner.odds,
                                                                    type: getBetType(category),
                                                                    homeClub,
                                                                    awayClub,
                                                                    description: `${Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                        ? homeClub.name 
                                                                        : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                        ? awayClub.name 
                                                                        : 'Draw'} ${Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams ${bothTeamScorerAndWinner.isYes ? 'Score' : 'Do Not Score'}`,
                                                                    category
                                                                })}
                                                            >
                                                                <span>{formatOdds(bothTeamScorerAndWinner.odds)}</span>
                                                                {#if isBetSelected(bothTeamScorerAndWinner.odds, `${Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                        ? homeClub.name 
                                                                        : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                        ? awayClub.name 
                                                                        : 'Draw'} ${Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams ${bothTeamScorerAndWinner.isYes ? 'Score' : 'Do Not Score'}`)}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </button>
                                                        </div>
                                                    {/each}
                                                    {#each matchOdds.bothTeamsToScoreAndWinner.filter(x => !x.isYes).sort(sortByLowestOdds) as bothTeamScorerAndWinner}
                                                        <div class="grid grid-cols-4">
                                                            <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                                                {Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                    ? homeClub.name 
                                                                    : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                    ? awayClub.name 
                                                                    : 'Draw'} {Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams Do Not Score
                                                            </div>
                                                            <button 
                                                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                                on:click={() => addToBetslip({ 
                                                                    result: bothTeamScorerAndWinner.result,
                                                                    bothTeamsScore: bothTeamScorerAndWinner.isYes,
                                                                    odds: bothTeamScorerAndWinner.odds,
                                                                    type: getBetType(category),
                                                                    homeClub,
                                                                    awayClub,
                                                                    description: `${Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                        ? homeClub.name 
                                                                        : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                        ? awayClub.name 
                                                                        : 'Draw'} ${Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams ${bothTeamScorerAndWinner.isYes ? 'Score' : 'Do Not Score'}`,
                                                                    category
                                                                })}
                                                            >
                                                                <span>{formatOdds(bothTeamScorerAndWinner.odds)}</span>
                                                                {#if isBetSelected(bothTeamScorerAndWinner.odds, `${Object.keys(bothTeamScorerAndWinner.result)[0] === 'HomeWin'
                                                                        ? homeClub.name 
                                                                        : Object.keys(bothTeamScorerAndWinner.result)[0] === 'AwayWin'
                                                                        ? awayClub.name 
                                                                        : 'Draw'} ${Object.keys(bothTeamScorerAndWinner.result)[0] !== 'Draw' ? 'Win' : ''} & Both Teams ${bothTeamScorerAndWinner.isYes ? 'Score' : 'Do Not Score'}`)}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </button>
                                                        </div>
                                                    {/each}
                                                {:else}
                                                    {#each getOddsForCategory(category).sort(sortByLowestOdds) as odd}
                                                        <div class="grid grid-cols-4">
                                                            <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                                                {getOddDisplayText(odd)}
                                                            </div>
                                                            <button 
                                                                class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                                on:click={() => {
                                                                    const betExists = selectedBets.some(bet => 
                                                                        bet.odds === getOddValue(odd) && 
                                                                        bet.description === getOddDisplayText(odd)
                                                                    );
                                                                    
                                                                    if (betExists) {
                                                                        removeBetFromBetslip({ 
                                                                            odds: getOddValue(odd),
                                                                            description: getOddDisplayText(odd)
                                                                        });
                                                                    } else {
                                                                        addToBetslip({ 
                                                                            type: getBetType(category),
                                                                            odds: getOddValue(odd),
                                                                            description: getOddDisplayText(odd),
                                                                            homeClub,
                                                                            awayClub,
                                                                            category
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                {getOddValue(odd).toFixed(2)}
                                                                {#if isBetSelected(getOddValue(odd), getOddDisplayText(odd))}
                                                                    <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                                {/if}
                                                            </button>
                                                        </div>
                                                    {/each}
                                                {/if}
                                            </div>
                                        </div>
                                    {:else if category === 'bothTeamsToScore'}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                                                <div class="col-span-3"></div>
                                                <div class="p-2">Odds</div>
                                            </div>
                                            <div class="divide-y divide-BrandOddsDivider">
                                                <div class="grid grid-cols-4">
                                                    <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">Yes</div>
                                                    <button 
                                                        class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                        on:click={() => {
                                                            if (yesSelected) {
                                                                yesSelected = false;
                                                                removeBetFromBetslip({ 
                                                                    type: 'team' as BetType,
                                                                    odds: matchOdds.bothTeamsToScore.yesOdds,
                                                                    description: 'Both Teams to Score: Yes',
                                                                    homeClub,
                                                                    awayClub
                                                                });
                                                            } else {
                                                                yesSelected = true;
                                                                noSelected = false;
                                                                addToBetslip({ 
                                                                    type: 'team' as BetType,
                                                                    odds: matchOdds.bothTeamsToScore.yesOdds,
                                                                    description: 'Both Teams to Score: Yes',
                                                                    homeClub,
                                                                    awayClub
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <span>{formatOdds(matchOdds.bothTeamsToScore.yesOdds)}</span>
                                                        {#if yesSelected}
                                                            <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                        {/if}
                                                    </button>
                                                </div>
                                                <div class="grid grid-cols-4">
                                                    <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">No</div>
                                                    <button 
                                                        class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                        on:click={() => {
                                                            if (noSelected) {
                                                                noSelected = false;
                                                                removeBetFromBetslip({ 
                                                                    type: 'team' as BetType,
                                                                    odds: matchOdds.bothTeamsToScore.noOdds,
                                                                    description: 'Both Teams to Score: No',
                                                                    homeClub,
                                                                    awayClub
                                                                });
                                                            } else {
                                                                noSelected = true;
                                                                yesSelected = false;
                                                                addToBetslip({ 
                                                                    type: 'team' as BetType,
                                                                    odds: matchOdds.bothTeamsToScore.noOdds,
                                                                    description: 'Both Teams to Score: No',
                                                                    homeClub,
                                                                    awayClub
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <span>{formatOdds(matchOdds.bothTeamsToScore.noOdds)}</span>
                                                        {#if noSelected}
                                                            <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                        {/if}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    {:else if category === 'goalsOverUnder'}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-3 font-bold text-center text-black bg-white">
                                                <div class="p-2">Goals</div>
                                                <div class="p-2">Over</div>
                                                <div class="p-2">Under</div>
                                            </div>
                                            <div class="divide-y divide-BrandOddsDivider">
                                                {#each matchOdds.goalsOverUnder.overOdds.sort(sortByLowestOdds) as overCategory}
                                                    <div class="grid grid-cols-3">
                                                        <div class="p-4 text-base text-center bg-BrandLightGray">
                                                            {overCategory.margin}
                                                        </div>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => {
                                                                const description = `Over ${overCategory.margin} Goals`;
                                                                if (toggleBetSelection(overCategory.odds, description)) {
                                                                    addToBetslip({ 
                                                                        type: 'over', 
                                                                        margin: overCategory.margin, 
                                                                        odds: overCategory.odds,
                                                                        description,
                                                                        homeClub,
                                                                        awayClub,
                                                                        category: 'goalsOverUnder'
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <span>{formatOdds(overCategory.odds)}</span>
                                                            {#if isBetSelected(overCategory.odds, `Over ${overCategory.margin} Goals`)}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => {
                                                                const odds = matchOdds.goalsOverUnder.underOdds.find(x => x.margin == overCategory.margin)?.odds ?? 0;
                                                                const description = `Under ${overCategory.margin} Goals`;
                                                                if (toggleBetSelection(odds, description)) {
                                                                    addToBetslip({ 
                                                                        type: 'under', 
                                                                        margin: overCategory.margin, 
                                                                        odds,
                                                                        description,
                                                                        homeClub,
                                                                        awayClub,
                                                                        category: 'goalsOverUnder'
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <span>{formatOdds(matchOdds.goalsOverUnder.underOdds.find(x => x.margin == overCategory.margin)?.odds ?? 0)}</span>
                                                            {#if isBetSelected(matchOdds.goalsOverUnder.underOdds.find(x => x.margin == overCategory.margin)?.odds ?? 0, `Under ${overCategory.margin} Goals`)}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    {:else if category === 'penaltyMissed'}
                                        <div class="overflow-hidden text-sm border rounded-b bg-BrandDarkGray border-BrandPurple">
                                            <div class="grid grid-cols-4 font-bold text-center text-black bg-white">
                                                <div class="col-span-3"></div>
                                                <div class="p-2">Odds</div>
                                            </div>
                                            <div class="divide-y divide-BrandOddsDivider">
                                                {#each matchOdds.halfTimeFullTimeResult.sort(sortByLowestOdds) as halfTimeFullTime}
                                                    <div class="grid grid-cols-4">
                                                        <div class="col-span-3 p-4 text-base text-left bg-BrandLightGray">
                                                            {(() => {
                                                                const getResultText = (result: string) => {
                                                                    switch(result) {
                                                                        case 'HomeWin': return homeClub.name;
                                                                        case 'AwayWin': return awayClub.name;
                                                                        case 'Draw': return 'Draw';
                                                                        default: return result;
                                                                    }
                                                                };
                                                                const htResult = getResultText(Object.keys(halfTimeFullTime.firstHalfResult)[0]);
                                                                const ftResult = getResultText(Object.keys(halfTimeFullTime.secondHalfResult)[0]);
                                                                return `${htResult} at HT / ${ftResult} at FT`;
                                                            })()}
                                                        </div>
                                                        <button 
                                                            class="flex items-center justify-center gap-2 p-4 text-lg text-white bg-BrandGray hover:bg-BrandGray/80"
                                                            on:click={() => {
                                                                const getResultText = (result: string) => {
                                                                    switch(result) {
                                                                        case 'HomeWin': return homeClub.name;
                                                                        case 'AwayWin': return awayClub.name;
                                                                        case 'Draw': return 'Draw';
                                                                        default: return result;
                                                                    }
                                                                };
                                                                const htResult = getResultText(Object.keys(halfTimeFullTime.firstHalfResult)[0]);
                                                                const ftResult = getResultText(Object.keys(halfTimeFullTime.secondHalfResult)[0]);
                                                                const description = `Half Time/Full Time: ${htResult} at HT / ${ftResult} at FT`;
                                                                if (toggleBetSelection(halfTimeFullTime.odds, description)) {
                                                                    addToBetslip({ 
                                                                        type: 'halftime-fulltime' as BetType,
                                                                        odds: halfTimeFullTime.odds,
                                                                        description,
                                                                        homeClub,
                                                                        awayClub
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <span>{formatOdds(halfTimeFullTime.odds)}</span>
                                                            {#if isBetSelected(halfTimeFullTime.odds, `Half Time/Full Time: ${(() => {
                                                                const getResultText = (result: string) => {
                                                                    switch(result) {
                                                                        case 'HomeWin': return homeClub.name;
                                                                        case 'AwayWin': return awayClub.name;
                                                                        case 'Draw': return 'Draw';
                                                                        default: return result;
                                                                    }
                                                                };
                                                                const htResult = getResultText(Object.keys(halfTimeFullTime.firstHalfResult)[0]);
                                                                const ftResult = getResultText(Object.keys(halfTimeFullTime.secondHalfResult)[0]);
                                                                return `${htResult} at HT / ${ftResult} at FT`;
                                                            })()}`)}
                                                                <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                            {/if}
                                                        </button>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    {:else if category === 'correctResults'}
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
                                                        const description = `${homeClub.name} to Win`;
                                                        if (toggleBetSelection(matchOdds.correctResults.homeOdds, description)) {
                                                            addToBetslip({ 
                                                                type: 'home', 
                                                                odds: matchOdds.correctResults.homeOdds,
                                                                description,
                                                                homeClub,
                                                                awayClub,
                                                                category: 'correctResults'
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <span class="mb-2 font-medium">Win</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-xl">{formatOdds(matchOdds.correctResults.homeOdds)}</span>
                                                        {#if isBetSelected(matchOdds.correctResults.homeOdds, `${homeClub.name} to Win`)}
                                                            <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                        {/if}
                                                    </div>
                                                </button>
                                                <button 
                                                    class="flex flex-col items-center justify-center p-4 mx-2 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                    on:click={() => addToBetslip({ 
                                                        type: 'draw', 
                                                        odds: matchOdds.correctResults.drawOdds,
                                                        description: 'Match to End in Draw',
                                                        homeClub,
                                                        awayClub,
                                                        category: 'correctResults'
                                                    })}
                                                >
                                                    <span class="mb-2 font-medium">Draw</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-xl">{formatOdds(matchOdds.correctResults.drawOdds)}</span>
                                                        {#if isBetSelected(matchOdds.correctResults.drawOdds, 'Match to End in Draw')}
                                                            <BetSelectedIcon className="w-4 h-4 fill-BrandPurple" />
                                                        {/if}
                                                    </div>
                                                </button>
                                                <button 
                                                    class="flex flex-col items-center justify-center p-4 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                    on:click={() => addToBetslip({ 
                                                        type: 'away', 
                                                        odds: matchOdds.correctResults.awayOdds,
                                                        description: `${awayClub.name} to Win`,
                                                        homeClub,
                                                        awayClub,
                                                        category: 'correctResults'
                                                    })}
                                                >
                                                    <span class="mb-2 font-medium">Win</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-xl">{formatOdds(matchOdds.correctResults.awayOdds)}</span>
                                                        {#if isBetSelected(matchOdds.correctResults.awayOdds, `${awayClub.name} to Win`)}
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
                                                    <span class="text-white">
                                                        {getOddDisplayText(odd)}
                                                    </span>
                                                    <button 
                                                        class="flex items-center justify-center gap-2 px-4 py-2 text-white rounded bg-BrandGray hover:bg-BrandGray/80"
                                                        on:click={() => {
                                                            const betExists = selectedBets.some(bet => 
                                                                bet.odds === getOddValue(odd) && 
                                                                bet.description === getOddDisplayText(odd)
                                                            );
                                                            
                                                            if (betExists) {
                                                                removeBetFromBetslip({ 
                                                                    odds: getOddValue(odd),
                                                                    description: getOddDisplayText(odd)
                                                                });
                                                            } else {
                                                                addToBetslip({ 
                                                                    type: getBetType(category),
                                                                    odds: getOddValue(odd),
                                                                    description: getOddDisplayText(odd),
                                                                    homeClub,
                                                                    awayClub,
                                                                    category
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {getOddValue(odd).toFixed(2)}
                                                        {#if isBetSelected(getOddValue(odd), getOddDisplayText(odd))}
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
                    {selectedBets} 
                    onBetsUpdate={(updatedBets) => selectedBets = updatedBets}
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
                    <Betslip 
                        {selectedBets} 
                        bind:isExpanded={isBetSlipExpanded}
                        onBetsUpdate={(updatedBets) => selectedBets = updatedBets}
                    />
                </div>
            {/if}
        </div>
    </div>
</Layout>

