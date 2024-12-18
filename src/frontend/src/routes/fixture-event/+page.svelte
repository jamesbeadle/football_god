<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import type { ClubDTO, FixtureDTO, MatchOddsDTO, PlayerDTO } from "../../../../declarations/backend/backend.did";
    import Layout from "../Layout.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import { bettingStore } from "$lib/stores/betting-store";
    import { playerStore } from "$lib/stores/player-store";
    import { clubStore } from "$lib/stores/club-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import { formatUnixDateToReadable, formatUnixTimeToTime } from "$lib/utils/helpers";

    let isLoading = true;

    $: leagueId = Number($page.url.searchParams.get("leagueId"));
    $: fixtureId = Number($page.url.searchParams.get("fixtureId"));
    let matchOdds: MatchOddsDTO;
    let players: PlayerDTO[];
    let fixture: FixtureDTO;
    let homeClub: ClubDTO;
    let awayClub: ClubDTO;

    onMount(async () => {
        try{
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
</script>

<Layout>
    {#if isLoading}
        <FullScreenSpinner />
    {:else}
    <div class="flex flex-col space-y-4 p-4 bg-gray-900 text-white">
        <div class="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" class="hover:text-white">Home</a>
            <span>/</span>
            <a href="/fixture-event?leagueId=${leagueId}&fixtureId=${fixtureId}" class="hover:text-white">{homeClub.friendlyName} v {awayClub.friendlyName}</a>
        </div>

        <div class="flex flex-col items-center space-y-2 text-center">
            <h1 class="text-xl font-bold">
                {homeClub.friendlyName} vs. {awayClub.friendlyName}
            </h1>
            <span class="text-sm text-gray-400">{ formatUnixDateToReadable(Number(fixture.kickOff)) } { formatUnixTimeToTime(Number(fixture.kickOff)) }</span>
        </div>

        <div class="flex justify-center space-x-2">
            <button class="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">All</button>
            <button class="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">Goals</button>
            <button class="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">Player</button>
            <button class="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">Team</button>
            <button class="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600">Half Time</button>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Full Time Result</h2>
            <div class="flex justify-between text-center">
                <div class="flex-1">
                    <p class="font-medium">Win</p>
                    <p class="text-xl">{formatOdds(matchOdds.correctResults.homeOdds)}</p>
                </div>
                <div class="flex-1">
                    <p class="font-medium">Draw</p>
                    <p class="text-xl">{formatOdds(matchOdds.correctResults.drawOdds)}</p>
                </div>
                <div class="flex-1">
                    <p class="font-medium">Win</p>
                    <p class="text-xl">{formatOdds(matchOdds.correctResults.awayOdds)}</p>
                </div>
            </div>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Correct Scores</h2>
            <ul class="space-y-2">
                {#each matchOdds.correctScores as score}
                    <li class="flex justify-between">
                        <span>{score.homeGoals} - {score.awayGoals}</span>
                        <span>{formatOdds(score.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Goalscorers</h2>
            <table class="w-full space-y-2">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>First</th>
                        <th>Anytime</th>
                        <th>Last</th>
                    </tr>
                </thead>
                <tbody>
                    {#each matchOdds.anytimeScorers as anytimeScorer}
                        {@const player = players.find(x => x.id == anytimeScorer.playerId)}
                        {@const firstScorerOdds = matchOdds.firstGoalscorers.find(x => x.playerId == player?.id)}
                        {@const lastScorerOdds = matchOdds.lastGoalscorers.find(x => x.playerId == player?.id)}
                        <tr>
                            <td>
                                <span>{player?.firstName} {player?.lastName}</span>
                            </td>
                            <td>
                                <span>{formatOdds(firstScorerOdds?.odds ?? 0)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(anytimeScorer.odds)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(lastScorerOdds?.odds ?? 0)}</span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>



        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Assists</h2>
            <table class="w-full space-y-2">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>First</th>
                        <th>Anytime</th>
                        <th>Last</th>
                    </tr>
                </thead>
                <tbody>
                    {#each matchOdds.anytimeAssist as anytimeAssister}
                        {@const player = players.find(x => x.id == anytimeAssister.playerId)}
                        {@const firstAssisterOdds = matchOdds.firstAssisters.find(x => x.playerId == player?.id)}
                        {@const lastAssisterOdds = matchOdds.lastAssist.find(x => x.playerId == player?.id)}
                        <tr>
                            <td>
                                <span>{player?.firstName} {player?.lastName}</span>
                            </td>
                            <td>
                                <span>{formatOdds(firstAssisterOdds?.odds ?? 0)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(anytimeAssister.odds)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(lastAssisterOdds?.odds ?? 0)}</span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Score Brace</h2>
            <ul class="space-y-2">
                {#each matchOdds.scoresBrace as braceScorer}
                {@const player = players.find(x => x.id == braceScorer.playerId)}
                <li class="flex justify-between">
                    <span>{player?.firstName} {player?.lastName}</span>
                    <span>{formatOdds(braceScorer.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Score Hat-Trick</h2>
            <ul class="space-y-2">
                {#each matchOdds.scoresHatTrick as hatTrickScorer}
                {@const player = players.find(x => x.id == hatTrickScorer.playerId)}
                <li class="flex justify-between">
                    <span>{player?.firstName} {player?.lastName}</span>
                    <span>{formatOdds(hatTrickScorer.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>


        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Cards</h2>
            <table class="w-full space-y-2">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Yellow</th>
                        <th>Red</th>
                    </tr>
                </thead>
                <tbody>
                    {#each matchOdds.yellowCards as yellowCarded}
                        {@const player = players.find(x => x.id == yellowCarded.playerId)}
                        {@const redCarded = matchOdds.redCards.find(x => x.playerId == player?.id)}
                        <tr>
                            <td>
                                <span>{player?.firstName} {player?.lastName}</span>
                            </td>
                            <td>
                                <span>{formatOdds(yellowCarded.odds)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(redCarded?.odds ?? 0)}</span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        
        

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Miss Penalty</h2>
            <ul class="space-y-2">
                {#each matchOdds.penaltyMissers as penaltyMisser}
                {@const player = players.find(x => x.id == penaltyMisser.playerId)}
                <li class="flex justify-between">
                    <span>{player?.firstName} {player?.lastName}</span>
                    <span>{formatOdds(penaltyMisser.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>


        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Half Time / Full Time</h2>
            <ul class="space-y-2">
                {#each matchOdds.halfTimeFullTimeResult as halfTimeFullTime}
                <li class="flex justify-between">
                    <span>{Object.keys(halfTimeFullTime.firstHalfResult)[0]}</span>
                    <span>{formatOdds(halfTimeFullTime.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Half Time Correct Scores</h2>
            <ul class="space-y-2">
                {#each matchOdds.halfTimeScores as score}
                    <li class="flex justify-between">
                        <span>{score.homeGoals} - {score.awayGoals}</span>
                        <span>{formatOdds(score.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>


        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Both Teams To Score</h2>
            <ul class="space-y-2">
                <li class="flex justify-between">
                    <span>Yes</span>
                    <span>{formatOdds(matchOdds.bothTeamsToScore.yesOdds)}</span>
                </li>
                    <li class="flex justify-between">
                    <span>No</span>
                    <span>{formatOdds(matchOdds.bothTeamsToScore.noOdds)}</span>
                </li>
            </ul>
        </div>


        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Both Teams To Score And Win</h2>
            <ul class="space-y-2">
                {#each matchOdds.bothTeamsToScoreAndWinner as bothTeamScorerAndWinner}
                    <li class="flex justify-between">
                        <span>{bothTeamScorerAndWinner.isYes ? "YES" : "NO"}</span>
                        <span>{formatOdds(bothTeamScorerAndWinner.odds)}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Goals Over / Under</h2>
            <table class="w-full space-y-2">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Over</th>
                        <th>Under</th>
                    </tr>
                </thead>
                <tbody>
                    {#each matchOdds.goalsOverUnder.overOdds as overCategory}
                        <tr>
                            <td>
                                <span>{overCategory.margin}</span>
                            </td>
                            <td>
                                <span>{formatOdds(overCategory.odds)}</span>
                            </td>
                            <td>
                                <span>{formatOdds(matchOdds.goalsOverUnder.underOdds.find(x => x.margin == overCategory.margin)!.odds  ?? 0)}</span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>


        <div class="bg-gray-800 p-4 rounded">
            <h2 class="text-lg font-semibold mb-4">Penalty Missed</h2>
            <ul class="space-y-2">
                <li class="flex justify-between">
                    <span>Home Team</span>
                    <span>{formatOdds(matchOdds.penaltyMissed.homeTeam)}</span>
                </li>
                    <li class="flex justify-between">
                    <span>Away Team</span>
                    <span>{formatOdds(matchOdds.penaltyMissed.awayTeam)}</span>
                </li>
            </ul>
        </div>
    </div>

    {/if}
</Layout>
