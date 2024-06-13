<script lang="ts">
    import { SvelteComponent, onMount } from "svelte";
    import Layout from "../Layout.svelte";
    import { euro2024Store } from "$lib/stores/euro2024.store";
    import { page } from "$app/stores";
    import { teamStore } from "$lib/stores/teams.store";
    import { playerStore } from "$lib/stores/player.store";
    import type { Euro2024EventDTO, Euro2024PredictionDTO, PredictionSet } from "../../../../declarations/football_god_backend/football_god_backend.did";
    
    
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

                        let winnerId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId;


                        let loserId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId;

                        if(!winnerId || !loserId){
                            return 0;
                        }

                        if(prediction.r16Prediction.winner == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId
                            && prediction.r16Prediction.loser == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId;


                        let goalAssisterId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId;

                        if(!goalScorerId || !goalAssisterId){
                            return 0;
                        }

                        if(prediction.r16Prediction.goalScorer == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId
                            && prediction.r16Prediction.goalAssister == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId;


                        let redCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId;

                        if(!yellowCardId || !redCardId){
                            return 0;
                        }

                        if(prediction.r16Prediction.yellowCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId
                            && prediction.r16Prediction.redCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "RoundOf16" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "QF":
                switch(grouping){
                    case "Result":

                        let winnerId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId;


                        let loserId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId;

                        if(!winnerId || !loserId){
                            return 0;
                        }

                        if(prediction.qfPrediction.winner == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId
                            && prediction.qfPrediction.loser == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId;


                        let goalAssisterId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId;

                        if(!goalScorerId || !goalAssisterId){
                            return 0;
                        }

                        if(prediction.qfPrediction.goalScorer == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId
                            && prediction.qfPrediction.goalAssister == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId;


                        let redCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId;

                        if(!yellowCardId || !redCardId){
                            return 0;
                        }

                        if(prediction.qfPrediction.yellowCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId
                            && prediction.qfPrediction.redCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "QuarterFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "SF":
                switch(grouping){
                    case "Result":

                        let winnerId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId;


                        let loserId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId;

                        if(!winnerId || !loserId){
                            return 0;
                        }

                        if(prediction.sfPrediction.winner == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId
                            && prediction.sfPrediction.loser == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId;


                        let goalAssisterId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId;

                        if(!goalScorerId || !goalAssisterId){
                            return 0;
                        }

                        if(prediction.sfPrediction.goalScorer == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId
                            && prediction.sfPrediction.goalAssister == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId;


                        let redCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId;

                        if(!yellowCardId || !redCardId){
                            return 0;
                        }

                        if(prediction.sfPrediction.yellowCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId
                            && prediction.sfPrediction.redCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "SemiFinal" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                }
                break;
            case "F":
                switch(grouping){
                    case "Result":

                        let winnerId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId;


                        let loserId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId;

                        if(!winnerId || !loserId){
                            return 0;
                        }

                        if(prediction.fPrediction.winner == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "Winner")!.teamId
                            && prediction.fPrediction.loser == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "Loser")!.teamId
                            ) {
                                return 40;
                            }
                        break;
                    case "Goals":

                        let goalScorerId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId;


                        let goalAssisterId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId;

                        if(!goalScorerId || !goalAssisterId){
                            return 0;
                        }

                        if(prediction.fPrediction.goalScorer == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalScored")!.playerId
                            && prediction.fPrediction.goalAssister == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "GoalAssisted")!.playerId
                            ) {
                                return 80;
                            }
                        break;
                    case "Cards":

                        let yellowCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId;


                        let redCardId = events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId;

                        if(!yellowCardId || !redCardId){
                            return 0;
                        }

                        if(prediction.fPrediction.yellowCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "YellowCard")!.playerId
                            && prediction.fPrediction.redCard == 
                            events.find(x => 
                                Object.keys(x.stage)[0] == "Final" && 
                                Object.keys(x.eventType)[0] == "RedCard")!.playerId
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Round Of 16 Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.r16Prediction.winner > 0 && prediction.r16Prediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("R16", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Round Of 16 Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.r16Prediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.r16Prediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.r16Prediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.r16Prediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.r16Prediction.loser)?.countryCode ?? "") then FlagComponent}
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.qfPrediction.winner > 0 && prediction.qfPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("QF", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.qfPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.qfPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode ?? "") then FlagComponent}
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>
        




        <div class="flex flex-col">
            <p>Quarter Final Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.qfPrediction.winner > 0 && prediction.qfPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("QF", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>

        <div class="flex flex-col">
            <p>Quarter Final Card Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">
                    {#if prediction.qfPrediction.winner > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.winner)?.countryCode ?? "") then FlagComponent}
                            {#if FlagComponent}
                                <svelte:component this={FlagComponent} className="w-6 ml-4" />
                            {/if}
                        {/await}
                    {:else }
                        <p>-</p>
                    {/if}
                </div>
                <div class="w-3/12">
                    {#if prediction.qfPrediction.loser > 0}
                        {$teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode }
                    
                        {#await getFlagComponent($teamStore.find(x => x.id == prediction.qfPrediction.loser)?.countryCode ?? "") then FlagComponent}
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>
        

        <div class="flex flex-col">
            <p>Semi Final Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.sfPrediction.winner > 0 && prediction.sfPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("SF", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>



        <div class="flex flex-col">
            <p>Final Match Results:</p>
            <div class="flex flex-row">
                <div class="w-3/12">-</div>
                <div class="w-3/12">-</div>

                <div class="w-3/12">
                    {#if prediction.fPrediction.winner > 0 && prediction.fPrediction.loser > 0}
                        {@const bonusPoints = getKnockOutBonusPoints("F", "Result")}
                        Both Correct Bonus ({bonusPoints > 0 ? 'Yes' : 'No'}): {bonusPoints}
                    {:else}
                        Both Correct Bonus (No): 0
                    {/if}</div>
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
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
                <div class="w-3/12">Total: 0</div>
            </div>
        </div>



      {/if}
    </div>
  </Layout>