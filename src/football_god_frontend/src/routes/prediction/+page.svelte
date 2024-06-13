<script lang="ts">
    import { SvelteComponent, onMount } from "svelte";
    import Layout from "../Layout.svelte";
    import { euro2024Store } from "$lib/stores/euro2024.store";
    import { page } from "$app/stores";
    import { teamStore } from "$lib/stores/teams.store";
    import { playerStore } from "$lib/stores/player.store";
    import type { Euro2024EventDTO, Euro2024PredictionDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
    
    
    let isLoading = true;
    let prediction: Euro2024PredictionDTO;
    let events: Euro2024EventDTO[] = [];
    let points: number = 0;
    
    $: id = $page.url.searchParams.get("id");
    
    const fetchPrediction = async () => {
      isLoading = true;
      try {
        await euro2024Store.sync();
        await playerStore.sync();
        let result = await euro2024Store.getPrediction(id ?? "");
        prediction = result;
        console.log(prediction)
        console.log("prediction")
        events = await euro2024Store.getEvents();
        console.log("events")
        console.log(events)
      } catch {
        console.error("Error fetching events");
      } finally {
        isLoading = false;
      }
    };
  
    onMount(async () => {
        await fetchPrediction();
        await teamStore.sync();
    });

    function getBonusCount(eventType: string): number{
        let count = 0;
        switch(eventType){
            case "StageWon":
                if(prediction.groupAPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.winner == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "StageWon")?.teamId){
                    count += 1; 
                }
                return count;
                break;
            case "StageLost":
                if(prediction.groupAPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.loser == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "StageLost")?.teamId){
                    count += 1; 
                }
                return count;
                break;
            case "GoalScored":
                if(prediction.groupAPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.goalScorer == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "GoalScored")?.playerId){
                    count += 1; 
                }
                return count;
                break;
            case "GoalAssisted":
                if(prediction.groupAPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.goalAssister == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "GoalAssisted")?.playerId){
                    count += 1; 
                }
                return count;
                break;
            case "YellowCard":
                if(prediction.groupAPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.yellowCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "YellowCard")?.playerId){
                    count += 1; 
                }
                return count;
                break;
            case "RedCard":
                if(prediction.groupAPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupA" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupBPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupB" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupCPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupC" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupDPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupD" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupEPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupE" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                if(prediction.groupFPrediction.redCard == 
                    events.find(x=>Object.keys(x.stage)[0] == "GroupF" && 
                        Object.keys(x.eventType)[0] == "RedCard")?.playerId){
                    count += 1; 
                }
                return count;
                break;
        }
        return 0;
    }

    function getKnockOutBonusPoints(round: string, grouping: string) : number{
        switch(round){
            case "R16":
                switch(grouping){
                    case "Result":

                        let winnerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "StageWon");


                        let loserEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "StageLost");

                        if(!winnerEvent || !loserEvent){
                            return 0;
                        }

                        if(prediction.r16Prediction.winner == winnerEvent.teamId
                            && prediction.r16Prediction.loser == loserEvent.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalScored");


                        let goalAssisterEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted");

                        if(!goalScorerEvent || !goalAssisterEvent){
                            return 0;
                        }

                        if(prediction.r16Prediction.goalScorer == goalScorerEvent.playerId
                            && prediction.r16Prediction.goalAssister == goalAssisterEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "YellowCard");


                        let redCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "RedCard");

                        if(!yellowCardEvent || !redCardEvent){
                            return 0;
                        }

                        if(prediction.r16Prediction.yellowCard == yellowCardEvent.playerId
                            && prediction.r16Prediction.redCard == redCardEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "QF":
                switch(grouping){
                    case "Result":

                        let winnerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "StageWon");


                        let loserEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "StageLost");

                        if(!winnerEvent || !loserEvent){
                            return 0;
                        }

                        if(prediction.qfPrediction.winner == winnerEvent.teamId
                            && prediction.qfPrediction.loser == loserEvent.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored");


                        let goalAssisterEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted");

                        if(!goalScorerEvent || !goalAssisterEvent){
                            return 0;
                        }

                        if(prediction.qfPrediction.goalScorer == goalScorerEvent.playerId
                            && prediction.qfPrediction.goalAssister == goalAssisterEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard");


                        let redCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard");

                        if(!yellowCardEvent || !redCardEvent){
                            return 0;
                        }

                        if(prediction.qfPrediction.yellowCard == yellowCardEvent.playerId
                            && prediction.qfPrediction.redCard == redCardEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "SF":
                switch(grouping){
                    case "Result":

                        let winnerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "StageWon");


                        let loserEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "StageLost");

                        if(!winnerEvent || !loserEvent){
                            return 0;
                        }

                        if(prediction.sfPrediction.winner == winnerEvent.teamId
                            && prediction.sfPrediction.loser == loserEvent.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored");


                        let goalAssisterEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted");

                        if(!goalScorerEvent || !goalAssisterEvent){
                            return 0;
                        }

                        if(prediction.sfPrediction.goalScorer == goalScorerEvent.playerId
                            && prediction.sfPrediction.goalAssister == goalAssisterEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard");


                        let redCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard");

                        if(!yellowCardEvent || !redCardEvent){
                            return 0;
                        }

                        if(prediction.sfPrediction.yellowCard == yellowCardEvent.playerId
                            && prediction.sfPrediction.redCard == redCardEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "F":
                switch(grouping){
                    case "Result":

                        let winnerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "StageWon");


                        let loserEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "StageLost");

                        if(!winnerEvent || !loserEvent){
                            return 0;
                        }

                        if(prediction.fPrediction.winner == winnerEvent.teamId
                            && prediction.fPrediction.loser == loserEvent.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalScored");


                        let goalAssisterEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted");

                        if(!goalScorerEvent || !goalAssisterEvent){
                            return 0;
                        }

                        if(prediction.fPrediction.goalScorer == goalScorerEvent.playerId
                            && prediction.fPrediction.goalAssister == goalAssisterEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!;


                        let redCardEvent = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "RedCard")!;

                        if(!yellowCardEvent || !redCardEvent){
                            return 0;
                        }

                        if(prediction.fPrediction.yellowCard == yellowCardEvent.playerId
                            && prediction.fPrediction.redCard == redCardEvent.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
        }
        return 0;
    }

    const getFlagComponent = async (countryCode: string): Promise<typeof SvelteComponent | null> => {
        switch (countryCode) {
        case 'ALB':
            return (await import('$lib/components/flags/alb.svelte')).default as typeof SvelteComponent;
        case 'AUS':
            return (await import('$lib/components/flags/aus.svelte')).default as typeof SvelteComponent;
        case 'BEL':
            return (await import('$lib/components/flags/bel.svelte')).default as typeof SvelteComponent;
        case 'CRO':
            return (await import('$lib/components/flags/cro.svelte')).default as typeof SvelteComponent;
        case 'CZE':
            return (await import('$lib/components/flags/cze.svelte')).default as typeof SvelteComponent;
        case 'DEN':
            return (await import('$lib/components/flags/den.svelte')).default as typeof SvelteComponent;
        case 'ENG':
            return (await import('$lib/components/flags/eng.svelte')).default as typeof SvelteComponent;
        case 'FRA':
            return (await import('$lib/components/flags/fra.svelte')).default as typeof SvelteComponent;
        case 'GEO':
            return (await import('$lib/components/flags/geo.svelte')).default as typeof SvelteComponent;
        case 'GER':
            return (await import('$lib/components/flags/ger.svelte')).default as typeof SvelteComponent;
        case 'HUN':
            return (await import('$lib/components/flags/hun.svelte')).default as typeof SvelteComponent;
        case 'ITA':
            return (await import('$lib/components/flags/ita.svelte')).default as typeof SvelteComponent;
        case 'NED':
            return (await import('$lib/components/flags/ned.svelte')).default as typeof SvelteComponent;
        case 'POL':
            return (await import('$lib/components/flags/pol.svelte')).default as typeof SvelteComponent;
        case 'POR':
            return (await import('$lib/components/flags/por.svelte')).default as typeof SvelteComponent;
        case 'ROM':
            return (await import('$lib/components/flags/rom.svelte')).default as typeof SvelteComponent;
        case 'SCO':
            return (await import('$lib/components/flags/sco.svelte')).default as typeof SvelteComponent;
        case 'SER':
            return (await import('$lib/components/flags/ser.svelte')).default as typeof SvelteComponent;
        case 'SKA':
            return (await import('$lib/components/flags/ska.svelte')).default as typeof SvelteComponent;
        case 'SVI':
            return (await import('$lib/components/flags/svi.svelte')).default as typeof SvelteComponent;
        case 'SPA':
            return (await import('$lib/components/flags/spa.svelte')).default as typeof SvelteComponent;
        case 'SWI':
            return (await import('$lib/components/flags/swi.svelte')).default as typeof SvelteComponent;
        case 'TUR':
            return (await import('$lib/components/flags/tur.svelte')).default as typeof SvelteComponent;
        case 'UKR':
            return (await import('$lib/components/flags/ukr.svelte')).default as typeof SvelteComponent;
        default:
            return null;
        }
    };
  </script>
  
  <Layout>
    <div class="bg-panel mt-4 p-4">
      <h1 class="my-4 default-header">Euro 2024 Prediction</h1>
      {#if isLoading}
        <div>Loading...</div>
      {:else}
        {@const stageWonCount = getBonusCount("StageWon")}
        {@const stageLostCount = getBonusCount("StageLost")}
        {@const goalScorerCount = getBonusCount("GoalScored")}
        {@const goalAssisterCount = getBonusCount("GoalAssisted")}
        {@const yellowCardCount = getBonusCount("YellowCard")}
        {@const redCardCount = getBonusCount("RedCard")}
        
        {@const r16WinnerCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "RoundWon" && x.teamId == prediction.r16Prediction.winner) != undefined}
        {@const r16LoserCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "RoundLost" && x.teamId == prediction.r16Prediction.loser) != undefined}
        {@const r16ScorerCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "GoalScored" && x.teamId == prediction.r16Prediction.goalScorer) != undefined}
        {@const r16AssisterCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "GoalAssisted" && x.teamId == prediction.r16Prediction.goalAssister) != undefined}
        {@const r16YellowCardCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "YellowCard" && x.teamId == prediction.r16Prediction.yellowCard) != undefined}
        {@const r16RedCardCorrect = events.find(x => Object.keys(x.stage)[0] == "RoundOf16" && Object.keys(x.eventType)[0] == "RedCard" && x.teamId == prediction.r16Prediction.redCard) != undefined}

        {@const qfWinnerCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "RoundWon" && x.teamId == prediction.qfPrediction.winner) != undefined}
        {@const qfLoserCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "RoundLost" && x.teamId == prediction.qfPrediction.loser) != undefined}
        {@const qfScorerCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "GoalScored" && x.teamId == prediction.qfPrediction.goalScorer) != undefined}
        {@const qfAssisterCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "GoalAssisted" && x.teamId == prediction.qfPrediction.goalAssister) != undefined}
        {@const qfYellowCardCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "YellowCard" && x.teamId == prediction.qfPrediction.yellowCard) != undefined}
        {@const qfRedCardCorrect = events.find(x => Object.keys(x.stage)[0] == "QuarterFinal" && Object.keys(x.eventType)[0] == "RedCard" && x.teamId == prediction.qfPrediction.redCard) != undefined}

        {@const sfWinnerCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "RoundWon" && x.teamId == prediction.sfPrediction.winner) != undefined}
        {@const sfLoserCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "RoundLost" && x.teamId == prediction.sfPrediction.loser) != undefined}
        {@const sfScorerCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "GoalScored" && x.teamId == prediction.sfPrediction.goalScorer) != undefined}
        {@const sfAssisterCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "GoalAssisted" && x.teamId == prediction.sfPrediction.goalAssister) != undefined}
        {@const sfYellowCardCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "YellowCard" && x.teamId == prediction.sfPrediction.yellowCard) != undefined}
        {@const sfRedCardCorrect = events.find(x => Object.keys(x.stage)[0] == "SemiFinal" && Object.keys(x.eventType)[0] == "RedCard" && x.teamId == prediction.sfPrediction.redCard) != undefined}

        {@const fWinnerCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "RoundWon" && x.teamId == prediction.fPrediction.winner) != undefined}
        {@const fLoserCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "RoundLost" && x.teamId == prediction.fPrediction.loser) != undefined}
        {@const fScorerCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "GoalScored" && x.teamId == prediction.fPrediction.goalScorer) != undefined}
        {@const fAssisterCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "GoalAssisted" && x.teamId == prediction.fPrediction.goalAssister) != undefined}
        {@const fYellowCardCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "YellowCard" && x.teamId == prediction.fPrediction.yellowCard) != undefined}
        {@const fRedCardCorrect = events.find(x => Object.keys(x.stage)[0] == "Final" && Object.keys(x.eventType)[0] == "RedCard" && x.teamId == prediction.fPrediction.redCard) != undefined}

        
        <h1 class="my-4 default-header">Total Score: {prediction.totalScore}</h1>
        <div class="flex flex-col">
            <p>Group Winner Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupAPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupAPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupBPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupBPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupCPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupCPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupDPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupDPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupEPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupEPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.groupFPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupFPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                <div class="w-3/12">Bonus ({stageWonCount}/6): 0</div>
                <div class="w-3/12">Total: {(stageWonCount * 5) + (stageWonCount > 2 ? (stageWonCount * 5) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Group Loser Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupAPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupAPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupBPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupBPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupCPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupCPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupDPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupDPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupEPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupEPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.groupFPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.groupFPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                
                <div class="w-3/12">Bonus ({stageLostCount}/6): 0</div>
                <div class="w-3/12">Total: {(stageLostCount * 5) + (stageLostCount > 2 ? (stageLostCount * 5) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Group Scorer Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupAPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupBPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupCPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupDPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupEPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.goalScorer > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupFPrediction.goalScorer)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                <div class="w-3/12">Bonus ({goalScorerCount}/6): 0</div>
                <div class="w-3/12">Total: {(goalScorerCount * 10) + (goalScorerCount > 2 ? (goalScorerCount * 10) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Group Assister Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupAPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupBPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupCPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupDPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupEPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.goalAssister > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupFPrediction.goalAssister)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                <div class="w-3/12">Bonus ({goalAssisterCount}/6): 0</div>
                <div class="w-3/12">Total: {(goalAssisterCount * 10) + (goalAssisterCount > 2 ? (goalAssisterCount * 10) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Group Yellow Card Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupAPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupBPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupCPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupDPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupEPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.yellowCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupFPrediction.yellowCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                <div class="w-3/12">Bonus ({yellowCardCount}/6): 0</div>
                <div class="w-3/12">Total: {(yellowCardCount * 5) + (yellowCardCount > 2 ? (yellowCardCount * 5) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Group Red Card Selections:</p>
            <div class="flex flex-row">
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupAPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupAPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupBPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupBPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupCPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupCPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>

                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupDPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupDPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupEPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupEPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>


                <div class="w-1/12 flex flex-row">
                    {#if prediction.groupFPrediction.redCard > 0}
                        {@const player = $playerStore.find(x => x.id == prediction.groupFPrediction.redCard)}
                        {player?.lastName }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == player?.teamId)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                
                <div class="w-3/12">Bonus ({redCardCount}/6): 0</div>
                <div class="w-3/12">Total: {(redCardCount * 10) + (redCardCount > 2 ? (redCardCount * 10) : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Round Of 16 Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.r16Prediction.winner)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.winner)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.r16Prediction.loser)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.loser)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>

                <div class="w-3/12">
                    {#if prediction.r16Prediction.winner > 0 && prediction.r16Prediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("R16", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: {(r16WinnerCorrect ? 10 : 0) + (r16LoserCorrect ? 10 : 0) + (r16WinnerCorrect && r16LoserCorrect ? 40 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Round Of 16 Scorer Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.r16Prediction.goalScorer > 0 && prediction.r16Prediction.goalAssister > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("R16", "Goals")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(r16ScorerCorrect ? 20 : 0) + (r16AssisterCorrect ? 20 : 0) + (r16ScorerCorrect && r16AssisterCorrect ? 80 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Round Of 16 Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.r16Prediction.yellowCard > 0}
                        {$teamStore.find(x => x.id == prediction.r16Prediction.yellowCard)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.yellowCard)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.r16Prediction.redCard > 0}
                        {$teamStore.find(x => x.id == prediction.r16Prediction.redCard)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.redCard)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.r16Prediction.yellowCard > 0 && prediction.r16Prediction.redCard > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("R16", "Cards")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(r16YellowCardCorrect ? 10 : 0) + (r16RedCardCorrect ? 20 : 0) + (r16YellowCardCorrect && r16RedCardCorrect ? 60 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>

                <div class="w-3/12">
                    {#if prediction.qfPrediction.winner > 0 && prediction.qfPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("QF", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(qfWinnerCorrect ? 15 : 0) + (qfLoserCorrect ? 15 : 0) + (qfWinnerCorrect && qfLoserCorrect ? 60 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Scorer Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.qfPrediction.goalScorer > 0 && prediction.qfPrediction.goalAssister > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("QF", "Goals")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(qfScorerCorrect ? 30 : 0) + (qfAssisterCorrect ? 30 : 0) + (qfScorerCorrect && qfWinnerCorrect ? 120 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.qfPrediction.yellowCard > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.yellowCard)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.yellowCard)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.qfPrediction.redCard > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.redCard)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.redCard)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.qfPrediction.yellowCard > 0 && prediction.qfPrediction.redCard > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("QF", "Cards")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(qfYellowCardCorrect ? 15 : 0) + (qfRedCardCorrect ? 30 : 0) + (qfYellowCardCorrect && qfRedCardCorrect ? 90 : 0)}</div>
            </div>
        </div>
        

        <div class="flex flex-col">
            <p>Semi Final Match Results:</p>
            <div class="flex flex-row">
                
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.sfPrediction.winner)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.sfPrediction.winner)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.sfPrediction.loser)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.sfPrediction.loser)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>

                <div class="w-3/12">
                    {#if prediction.sfPrediction.winner > 0 && prediction.sfPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("SF", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(sfWinnerCorrect ? 20 : 0) + (sfLoserCorrect ? 20 : 0) + (sfWinnerCorrect && sfLoserCorrect ? 80 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Semi Final Scorer Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.sfPrediction.goalScorer > 0 && prediction.sfPrediction.goalAssister > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("SF", "Goals")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(sfScorerCorrect ? 40 : 0) + (sfAssisterCorrect ? 40 : 0) + (sfScorerCorrect && sfAssisterCorrect ? 160 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Semi Final Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.sfPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.sfPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.sfPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.sfPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.sfPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.sfPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.sfPrediction.yellowCard > 0 && prediction.sfPrediction.redCard > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("SF", "Cards")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(sfYellowCardCorrect ? 20 : 0) + (sfRedCardCorrect ? 40 : 0) + (sfYellowCardCorrect && sfRedCardCorrect ? 120 : 0)}</div>
            </div>
        </div>



        <div class="flex flex-col">
            <p>Final Match Results:</p>
            <div class="flex flex-row">
                


                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.fPrediction.winner)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.fPrediction.winner)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>
                <div class="w-3/12 flex flex-row">
                    {$teamStore.find(x => x.id == prediction.fPrediction.loser)?.countryCode }
                    {#await getFlagComponent($teamStore.find(x => x.id == prediction.fPrediction.loser)?.countryCode ?? "") then FlagComponent}
                        {#if FlagComponent}
                            <svelte:component this={FlagComponent} className="w-6 ml-4" />
                        {/if}
                    {/await}
                </div>

                <div class="w-3/12">
                    {#if prediction.fPrediction.winner > 0 && prediction.fPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("F", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(fWinnerCorrect ? 25 : 0) + (fLoserCorrect ? 25 : 0) + (fWinnerCorrect && fLoserCorrect ? 100 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Final Scorer Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.fPrediction.goalScorer > 0 && prediction.fPrediction.goalAssister > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("F", "Goals")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(fScorerCorrect ? 50 : 0) + (fAssisterCorrect ? 50 : 0) + (fScorerCorrect && fAssisterCorrect ? 200 : 0)}</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Final Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.fPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.fPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.fPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.fPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.fPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.fPrediction.loser)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.fPrediction.yellowCard > 0 && prediction.fPrediction.redCard > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("F", "Cards")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                    <div class="w-3/12">Total: {(fYellowCardCorrect ? 25 : 0) + (fRedCardCorrect ? 50 : 0) + (fRedCardCorrect && fYellowCardCorrect ? 150 : 0)}</div>
            </div>
        </div>
      {/if}
    </div>
  </Layout>