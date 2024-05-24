<script lang="ts">
  import type {
    Euro2024PredictionDTO,
  } from "../../../../declarations/football_god_backend/football_god_backend.did";
  import Layout from "../Layout.svelte";
  import { onMount, onDestroy, SvelteComponent } from "svelte";
  import SelectTeamComponent from "$lib/components/euro2024/select-team-modal.svelte";
  import SelectPlayerComponent from "$lib/components/euro2024/select-player-modal.svelte";
  import { teamStore } from "$lib/stores/teams.store";
  import { playerStore } from "$lib/stores/player.store";
  import { writable } from "svelte/store";
  import { userStore } from "$lib/stores/user.store";
  import { isError } from "$lib/utils/helpers";
  import { toastsError, toastsShow } from "$lib/stores/toasts.store";
 
  let prediction: Euro2024PredictionDTO | undefined;

  let canEnterSweepstake = false; // TODO Update UI to use
  let sweepstakePaid = false; // TODO Update UI to use

  let selectedStage = -1;
  let predictionType = -1;
  let showSelectTeamModal = false;
  let showSelectPlayerModal = false;
  let interval: NodeJS.Timeout;

  const countdown = writable("");

  const groupStageTeams = [
    [10, 17, 11, 22],
    [21, 4, 12, 1],
    [20, 6, 18, 7],
    [14, 13, 2, 8],
    [3, 19, 16, 24],
    [23, 9, 15, 5]
  ];






  $: isSubmitDisabled = (
    prediction?.groupAPrediction == undefined ||
    prediction?.groupBPrediction == undefined ||
    prediction?.groupCPrediction == undefined ||
    prediction?.groupDPrediction == undefined ||
    prediction?.groupEPrediction == undefined ||
    prediction?.groupFPrediction == undefined ||
    prediction?.r16Prediction == undefined ||
    prediction?.qfPrediction == undefined ||
    prediction?.sfPrediction == undefined ||
    prediction?.fPrediction == undefined ||
    prediction?.groupAPrediction.winner == 0 ||
    prediction?.groupAPrediction.loser == 0 ||
    prediction?.groupAPrediction.goalScorer == 0 ||
    prediction?.groupAPrediction.goalAssister == 0 ||
    prediction?.groupAPrediction.yellowCard == 0 ||
    prediction?.groupAPrediction.redCard == 0 ||
    prediction?.groupBPrediction.winner == 0 ||
    prediction?.groupBPrediction.loser == 0 ||
    prediction?.groupBPrediction.goalScorer == 0 ||
    prediction?.groupBPrediction.goalAssister == 0 ||
    prediction?.groupBPrediction.yellowCard == 0 ||
    prediction?.groupBPrediction.redCard == 0 ||
    prediction?.groupCPrediction.winner == 0 ||
    prediction?.groupCPrediction.loser == 0 ||
    prediction?.groupCPrediction.goalScorer == 0 ||
    prediction?.groupCPrediction.goalAssister == 0 ||
    prediction?.groupCPrediction.yellowCard == 0 ||
    prediction?.groupCPrediction.redCard == 0 ||
    prediction?.groupDPrediction.winner == 0 ||
    prediction?.groupDPrediction.loser == 0 ||
    prediction?.groupDPrediction.goalScorer == 0 ||
    prediction?.groupDPrediction.goalAssister == 0 ||
    prediction?.groupDPrediction.yellowCard == 0 ||
    prediction?.groupDPrediction.redCard == 0 ||
    prediction?.groupEPrediction.winner == 0 ||
    prediction?.groupEPrediction.loser == 0 ||
    prediction?.groupEPrediction.goalScorer == 0 ||
    prediction?.groupEPrediction.goalAssister == 0 ||
    prediction?.groupEPrediction.yellowCard == 0 ||
    prediction?.groupEPrediction.redCard == 0 ||
    prediction?.groupFPrediction.winner == 0 ||
    prediction?.groupFPrediction.loser == 0 ||
    prediction?.groupFPrediction.goalScorer == 0 ||
    prediction?.groupFPrediction.goalAssister == 0 ||
    prediction?.groupFPrediction.yellowCard == 0 ||
    prediction?.groupFPrediction.redCard == 0 ||
    prediction?.r16Prediction.winner == 0 ||
    prediction?.r16Prediction.loser == 0 ||
    prediction?.r16Prediction.goalScorer == 0 ||
    prediction?.r16Prediction.goalAssister == 0 ||
    prediction?.r16Prediction.yellowCard == 0 ||
    prediction?.r16Prediction.redCard == 0 ||
    prediction?.qfPrediction.winner == 0 ||
    prediction?.qfPrediction.loser == 0 ||
    prediction?.qfPrediction.goalScorer == 0 ||
    prediction?.qfPrediction.goalAssister == 0 ||
    prediction?.qfPrediction.yellowCard == 0 ||
    prediction?.qfPrediction.redCard == 0 ||
    prediction?.qfPrediction.winner == 0 ||
    prediction?.qfPrediction.loser == 0 ||
    prediction?.qfPrediction.goalScorer == 0 ||
    prediction?.qfPrediction.goalAssister == 0 ||
    prediction?.qfPrediction.yellowCard == 0 ||
    prediction?.qfPrediction.redCard == 0 ||
    prediction?.qfPrediction.winner == 0 ||
    prediction?.qfPrediction.loser == 0 ||
    prediction?.qfPrediction.goalScorer == 0 ||
    prediction?.qfPrediction.goalAssister == 0 ||
    prediction?.qfPrediction.yellowCard == 0 ||
    prediction?.qfPrediction.redCard == 0
  );

  const fetchPrediction = async (): Promise<Euro2024PredictionDTO | undefined> => {    
    return userStore.getUserPrediction();
  };

  onMount(async () => {
    
    await teamStore.sync();
    await playerStore.sync();
    if($teamStore.length == 0 || $playerStore.length == 0){
      return;
    };

    prediction = await fetchPrediction();

    sweepstakePaid = prediction != undefined;

    if (!prediction) {
      prediction = {
        // Provide initial structure with empty/default values
        groupAPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        groupBPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        groupCPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        groupDPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        groupEPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        groupFPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        r16Prediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        qfPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        sfPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
        fPrediction: {
          goalAssister: 0,
          winner: 0,
          loser: 0,
          stage: { GroupA: null },
          goalScorer: 0,
          redCard: 0,
          yellowCard: 0,
        },
      };
    }
    
    const endDate = new Date("June 14, 2024 00:00:00 GMT+20:00").getTime();  
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        countdown.set(`Kick Off: ${days}d ${hours}h ${minutes}m`);
      };

      updateCountdown(); // Run once on component mount
      interval = setInterval(updateCountdown, 60000); 
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  async function handlePredictionSubmit() {

    if(!prediction){
      return;
    };

    let dto: Euro2024PredictionDTO = {
      'sfPrediction' : prediction?.sfPrediction,
      'groupAPrediction' : prediction?.groupAPrediction,
      'groupCPrediction' : prediction?.groupCPrediction,
      'groupEPrediction' : prediction?.groupEPrediction,
      'fPrediction' : prediction?.fPrediction,
      'qfPrediction' : prediction?.qfPrediction,
      'groupBPrediction' : prediction?.groupBPrediction,
      'groupDPrediction' : prediction?.groupDPrediction,
      'groupFPrediction' : prediction?.groupFPrediction,
      'r16Prediction' : prediction?.r16Prediction,
    };


    try {

      let result = await userStore.saveEuro2024Predictions(dto);
      if (isError(result)) {
        toastsError({
          msg: { text: "Error saving prediction on football god backend." },
          err: null,
        });
        console.error("Error saving prediction on football god backend", null);
      }

      sweepstakePaid = true;
      
      toastsShow({
        text: "Euro 2024 prediction saved.",
        level: "success",
        duration: 2000,
      });
    } catch (error) {
      toastsError({
        msg: { text: "Error saving Euro 2024 prediction." },
        err: error,
      });
      console.error("Error saving Euro 2024 prediction", error);
    }

    //TODO: Add in toast to say saved and update the text on the button to just say
    //saved and sweepstake entered

  };

  function selectWinner(stage: number) {
    predictionType = 0;
    selectedStage = stage;
    showSelectTeamModal = true;
  }
  function selectLoser(stage: number) {
    predictionType = 1;
    selectedStage = stage;
    showSelectTeamModal = true;
  }
  function selectScorer(stage: number) {
    predictionType = 2;
    selectedStage = stage;
    showSelectPlayerModal = true;
  }
  function selectAssister(stage: number) {
    predictionType = 3;
    selectedStage = stage;
    showSelectPlayerModal = true;
  }
  function selectYellowCard(stage: number) {
    predictionType = 4;
    selectedStage = stage;
    showSelectPlayerModal = true;
  }
  function selectRedCard(stage: number) {
    predictionType = 5;
    selectedStage = stage;
    showSelectPlayerModal = true;
  }

  function confirmTeamSelection(teamId: number) {
    switch (selectedStage) {
      case 0:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 1:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 2:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 3:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 4:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 5:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 6:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 7:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 8:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
      case 9:
        switch (predictionType) {
          case 0:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                winner: teamId,
              },
            };
            break;
          case 1:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                loser: teamId,
              },
            };
            break;
        }
        break;
    }
    showSelectTeamModal = false;
  }

  function confirmPlayerSelection(playerId: number) {
    switch (selectedStage) {
      case 0:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupAPrediction: {
                ...prediction?.groupAPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 1:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupBPrediction: {
                ...prediction?.groupBPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 2:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupCPrediction: {
                ...prediction?.groupCPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 3:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupDPrediction: {
                ...prediction?.groupDPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 4:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupEPrediction: {
                ...prediction?.groupEPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 5:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              groupFPrediction: {
                ...prediction?.groupFPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 6:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              r16Prediction: {
                ...prediction?.r16Prediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 7:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              qfPrediction: {
                ...prediction?.qfPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 8:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              sfPrediction: {
                ...prediction?.sfPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
      case 9:
        switch (predictionType) {
          case 2:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                goalScorer: playerId,
              },
            };
            break;
          case 3:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                goalAssister: playerId,
              },
            };
            break;
          case 4:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                yellowCard: playerId,
              },
            };
            break;
          case 5:
            prediction = {
              ...prediction!,
              fPrediction: {
                ...prediction?.fPrediction!,
                redCard: playerId,
              },
            };
            break;
        }
        break;
    }
    showSelectPlayerModal = false;
  }

  function closeTeamSelectionModal() {
    showSelectTeamModal = false;
    selectedStage = -1;
    predictionType = -1;
  }

  function closePlayerSelectionModal() {
    showSelectPlayerModal = false;
    selectedStage = -1;
    predictionType = -1;
  }

  function getTeamName(teamId: number): string {
    const team = $teamStore.find(team => team.id === teamId);
    return team ? team.name : "Select a Team";
  }

  function getPlayerName(playerId: number): string {
    const player = $playerStore.find(player => player.id === playerId);
    return player ? `${player.firstName.substring(0,1)} ${player.lastName}` : "Select a Player";
  }



  const getFlagComponent = async (countryId: number): Promise<typeof SvelteComponent | null> => {
    switch (countryId) {
      case 1:
        return (await import('$lib/components/flags/alb.svelte')).default as typeof SvelteComponent;
      case 2:
        return (await import('$lib/components/flags/aus.svelte')).default as typeof SvelteComponent;
      case 3:
        return (await import('$lib/components/flags/bel.svelte')).default as typeof SvelteComponent;
      case 4:
        return (await import('$lib/components/flags/cro.svelte')).default as typeof SvelteComponent;
      case 5:
        return (await import('$lib/components/flags/cze.svelte')).default as typeof SvelteComponent;
      case 6:
        return (await import('$lib/components/flags/den.svelte')).default as typeof SvelteComponent;
      case 7:
        return (await import('$lib/components/flags/eng.svelte')).default as typeof SvelteComponent;
      case 8:
        return (await import('$lib/components/flags/fra.svelte')).default as typeof SvelteComponent;
      case 9:
        return (await import('$lib/components/flags/geo.svelte')).default as typeof SvelteComponent;
      case 10:
        return (await import('$lib/components/flags/ger.svelte')).default as typeof SvelteComponent;
      case 11:
        return (await import('$lib/components/flags/hun.svelte')).default as typeof SvelteComponent;
      case 12:
        return (await import('$lib/components/flags/ita.svelte')).default as typeof SvelteComponent;
      case 13:
        return (await import('$lib/components/flags/den.svelte')).default as typeof SvelteComponent;
      case 14:
        return (await import('$lib/components/flags/pol.svelte')).default as typeof SvelteComponent;
      case 15:
        return (await import('$lib/components/flags/por.svelte')).default as typeof SvelteComponent;
      case 16:
        return (await import('$lib/components/flags/rom.svelte')).default as typeof SvelteComponent;
      case 17:
        return (await import('$lib/components/flags/sco.svelte')).default as typeof SvelteComponent;
      case 18:
        return (await import('$lib/components/flags/ser.svelte')).default as typeof SvelteComponent;
      case 19:
        return (await import('$lib/components/flags/ska.svelte')).default as typeof SvelteComponent;
      case 20:
        return (await import('$lib/components/flags/svi.svelte')).default as typeof SvelteComponent;
      case 21:
        return (await import('$lib/components/flags/spa.svelte')).default as typeof SvelteComponent;
      case 22:
        return (await import('$lib/components/flags/swi.svelte')).default as typeof SvelteComponent;
      case 23:
        return (await import('$lib/components/flags/tur.svelte')).default as typeof SvelteComponent;
      case 24:
        return (await import('$lib/components/flags/ukr.svelte')).default as typeof SvelteComponent;
      default:
        return null;
    }
  };

</script>

<Layout>
  {#if showSelectPlayerModal}
    <SelectPlayerComponent
      {confirmPlayerSelection}
      visible={showSelectPlayerModal}
      {closePlayerSelectionModal}
      players={selectedStage <= 5 ? $playerStore.filter(player => groupStageTeams[selectedStage].includes(player.teamId)) : $playerStore}
      teams={selectedStage <= 5 ? $teamStore.filter(team => groupStageTeams[selectedStage].includes(team.id)) : $teamStore}
     />
  {/if}

  {#if showSelectTeamModal}
    <SelectTeamComponent
      {confirmTeamSelection}
      visible={showSelectTeamModal}
      {closeTeamSelectionModal}
      teams={selectedStage <= 5 ? $teamStore.filter(team => groupStageTeams[selectedStage].includes(team.id)) : $teamStore}
    />
  {/if}

  <div class="bg-panel rounded-md p-4">
    <p class="text-xl my-2 mb-4">
      Welcome to the FootballGod Euro 2024 prediction game.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
        <div class="p-4 flex flex-col justify-between h-full">
          <p
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white items-center"
          >
            <img src="FPLCoin.png" alt="fpl" class="w-8 h-8 mr-2 mb-1" />
            Prize Pool: 0.00 $FPL
          </p>
        </div>
      </div>

      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
        <div class="flex flex-col justify-center h-full">
          <p
            class="inline-flex justify-center py-2 px-4 mx-2 border border-transparent shadow-sm font-bold rounded-md text-white"
          >
            Total Entries: 0
          </p>
        </div>
      </div>

      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
        <div class="flex flex-col justify-center h-full">
          <p class="w-full text-center">{$countdown}</p>
        </div>
      </div>
    </div>

    <div class="horizontal-divider my-4" />

    <p class="my-4 text-sm">
      Entry Fee: 100 $FPL
      <br />
      Prize Pool / Burn % split: 80:20
    </p> 

    <p>
      Make your selections below and enter the sweepstake to be in with a chance
      of winning $FPL.
    </p>

    <div class="horizontal-divider my-4" />

    
    <div class="flex flex-row items-center bg-OPENFPL text-GRAY border border-white rounded-md p-2 text-sm">
      <div class="w-1/12 flex">
        <p class="w-full text-center">Group</p>
      </div>
      <div class="w-11/12 flex flex-row space-x-2">
        <div class="w-1/6 flex">
          <p class="w-full text-center">Winner</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Loser</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">To Score</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">To Assist</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Yellow Card</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Red Card</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">A</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupAPrediction?.winner}
                {#await getFlagComponent(prediction?.groupAPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupAPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
        >
          {#if prediction?.groupAPrediction?.loser}
            <div class="flex items-center justify-center w-full">
              {#await getFlagComponent(prediction?.groupAPrediction.loser) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              <p class="ml-2">{getTeamName(prediction.groupAPrediction.loser)}</p>
            </div>
          {:else}
            Select a Team
          {/if}
        </button>
        
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupAPrediction?.goalScorer}
                {@const player = $playerStore.find(x => x.id == prediction?.groupAPrediction.goalScorer)}
                {@const teamId = player ? player.teamId : 0 }
                {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupAPrediction.goalScorer)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupAPrediction?.goalAssister}
                {@const player = $playerStore.find(x => x.id == prediction?.groupAPrediction.goalAssister)}
                {@const teamId = player ? player.teamId : 0 }  
                {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupAPrediction.goalAssister)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupAPrediction?.yellowCard}
                {@const player = $playerStore.find(x => x.id == prediction?.groupAPrediction.yellowCard)}
                {@const teamId = player ? player.teamId : 0 }  
                {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupAPrediction.yellowCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(0)}
            class="selection-panel 
              {prediction?.groupAPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupAPrediction?.redCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupAPrediction.redCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupAPrediction.redCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">B</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupBPrediction?.winner}
              {#await getFlagComponent(prediction?.groupBPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getTeamName(prediction.groupBPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupBPrediction?.loser}
              {#await getFlagComponent(prediction?.groupBPrediction.loser) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getTeamName(prediction.groupBPrediction.loser)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.groupBPrediction?.goalScorer}
            {@const player = $playerStore.find(x => x.id == prediction?.groupBPrediction.goalScorer)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
            {getPlayerName(prediction.groupBPrediction.goalScorer)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupBPrediction?.goalAssister}
              {@const player = $playerStore.find(x => x.id == prediction?.groupBPrediction.goalAssister)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupBPrediction.goalAssister)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupBPrediction?.yellowCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupBPrediction.yellowCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupBPrediction.yellowCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(1)}
            class="selection-panel 
              {prediction?.groupBPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupBPrediction?.redCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupBPrediction.redCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupBPrediction.redCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">C</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupCPrediction?.winner} 
              {#await getFlagComponent(prediction?.groupCPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getTeamName(prediction.groupCPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            > 
              {#if prediction?.groupCPrediction?.loser}
              {#await getFlagComponent(prediction?.groupCPrediction.loser) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getTeamName(prediction.groupCPrediction.loser)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            > 
              {#if prediction?.groupCPrediction?.goalScorer}
              {@const player = $playerStore.find(x => x.id == prediction?.groupCPrediction.goalScorer)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupCPrediction.goalScorer)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupCPrediction?.goalAssister}
              {@const player = $playerStore.find(x => x.id == prediction?.groupCPrediction.goalAssister)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupCPrediction.goalAssister)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupCPrediction?.yellowCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupCPrediction.yellowCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
              {getPlayerName(prediction.groupCPrediction.yellowCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(2)}
            class="selection-panel 
              {prediction?.groupCPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupCPrediction?.redCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupCPrediction.redCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupCPrediction.redCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">D</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.winner}
              {#await getFlagComponent(prediction?.groupDPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupDPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.loser}
              {#await getFlagComponent(prediction?.groupDPrediction.loser) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupDPrediction.loser)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.goalScorer}
              {@const player = $playerStore.find(x => x.id == prediction?.groupDPrediction.goalScorer)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupDPrediction.goalScorer)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.goalAssister}
              {@const player = $playerStore.find(x => x.id == prediction?.groupDPrediction.goalAssister)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupDPrediction.goalAssister)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.yellowCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupDPrediction.yellowCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupDPrediction.yellowCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(3)}
            class="selection-panel 
              {prediction?.groupDPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupDPrediction?.redCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupDPrediction.redCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupDPrediction.redCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">E</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.winner}
              {#await getFlagComponent(prediction?.groupEPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupEPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.loser}
              {#await getFlagComponent(prediction?.groupEPrediction.loser) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupEPrediction.loser)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.goalScorer}
              {@const player = $playerStore.find(x => x.id == prediction?.groupEPrediction.goalScorer)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupEPrediction.goalScorer)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.goalAssister}
              {@const player = $playerStore.find(x => x.id == prediction?.groupEPrediction.goalAssister)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupEPrediction.goalAssister)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.yellowCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupEPrediction.yellowCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupEPrediction.yellowCard)}
              {:else}
                Select a Player
              {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(4)}
            class="selection-panel 
              {prediction?.groupEPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupEPrediction?.redCard}
              {@const player = $playerStore.find(x => x.id == prediction?.groupEPrediction.redCard)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupEPrediction.redCard)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">F</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupFPrediction?.winner}
              {#await getFlagComponent(prediction?.groupFPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupFPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupFPrediction?.loser}
              {#await getFlagComponent(prediction?.groupFPrediction.loser) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.groupFPrediction.loser)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.groupFPrediction?.goalScorer}
              {@const player = $playerStore.find(x => x.id == prediction?.groupFPrediction.goalScorer)}
              {@const teamId = player ? player.teamId : 0 }  
              {#await getFlagComponent(teamId) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getPlayerName(prediction.groupFPrediction.goalScorer)}
              {:else}
                Select a Player
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.groupFPrediction?.goalAssister}
            {@const player = $playerStore.find(x => x.id == prediction?.groupFPrediction.goalAssister)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.groupFPrediction.goalAssister)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.groupFPrediction?.yellowCard}
            {@const player = $playerStore.find(x => x.id == prediction?.groupFPrediction.yellowCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.groupFPrediction.yellowCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(5)}
            class="selection-panel 
              {prediction?.groupFPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.groupFPrediction?.redCard}
            {@const player = $playerStore.find(x => x.id == prediction?.groupFPrediction.redCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.groupFPrediction.redCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2 text-sm">
      <div class="w-full">
        <p class="flex-1 block w-full bg-gray-800 py-4 px-2 text-center rounded-md">
          Receive double points for each group stage category you make 3 or more
          correct selections.
        </p>
      </div>
    </div>

    <div class="horizontal-divider my-4" />

    <div class="flex flex-row items-center bg-OPENFPL text-GRAY border border-white rounded-md p-2 my-4 text-sm">
      <div class="w-1/12 flex">
        <p class="w-full text-center">Stage</p>
      </div>
      <div class="w-11/12 flex flex-row space-x-2">
        <div class="w-1/6 flex">
          <p class="w-full text-center">Winner</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Loser</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">To Score</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">To Assist</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Yellow Card</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center">Red Card</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-600 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">R16</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.r16Prediction?.winner} 
              {#await getFlagComponent(prediction?.r16Prediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.r16Prediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.r16Prediction?.loser}
            {#await getFlagComponent(prediction?.r16Prediction.loser) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getTeamName(prediction.r16Prediction.loser)}
            {:else}
              Select a Team
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.r16Prediction?.goalScorer}
            {@const player = $playerStore.find(x => x.id == prediction?.r16Prediction.goalScorer)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.r16Prediction.goalScorer)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.r16Prediction?.goalAssister}
            {@const player = $playerStore.find(x => x.id == prediction?.r16Prediction.goalAssister)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.r16Prediction.goalAssister)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.r16Prediction?.yellowCard}
            {@const player = $playerStore.find(x => x.id == prediction?.r16Prediction.yellowCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.r16Prediction.yellowCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(6)}
            class="selection-panel 
              {prediction?.r16Prediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.r16Prediction?.redCard}
            {@const player = $playerStore.find(x => x.id == prediction?.r16Prediction.redCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.r16Prediction.redCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">20 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2 text-sm">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 40 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 80 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 60 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-blue-700 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">QF</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.qfPrediction?.winner}
              {#await getFlagComponent(prediction?.qfPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.qfPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.qfPrediction?.loser}
            {#await getFlagComponent(prediction?.qfPrediction.loser) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getTeamName(prediction.qfPrediction.loser)}
            {:else}
              Select a Team
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.qfPrediction?.goalScorer}
            {@const player = $playerStore.find(x => x.id == prediction?.qfPrediction.goalScorer)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.qfPrediction.goalScorer)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">30 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.qfPrediction?.goalAssister}
            {@const player = $playerStore.find(x => x.id == prediction?.qfPrediction.goalAssister)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.qfPrediction.goalAssister)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">30 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.qfPrediction?.yellowCard}
            {@const player = $playerStore.find(x => x.id == prediction?.qfPrediction.yellowCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.qfPrediction.yellowCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(7)}
            class="selection-panel 
              {prediction?.qfPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.qfPrediction?.redCard}
            {@const player = $playerStore.find(x => x.id == prediction?.qfPrediction.redCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.qfPrediction.redCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">30 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2 text-sm">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 60 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 120 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 90 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-blue-800 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">SF</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            >
              {#if prediction?.sfPrediction?.winner}
              {#await getFlagComponent(prediction?.sfPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.sfPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.sfPrediction?.loser}
            {#await getFlagComponent(prediction?.sfPrediction.loser) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getTeamName(prediction.sfPrediction.loser)}
            {:else}
              Select a Team
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.sfPrediction?.goalScorer}
            {@const player = $playerStore.find(x => x.id == prediction?.sfPrediction.goalScorer)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.sfPrediction.goalScorer)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">40 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.sfPrediction?.goalAssister}
            {@const player = $playerStore.find(x => x.id == prediction?.sfPrediction.goalAssister)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.sfPrediction.goalAssister)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">40 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.sfPrediction?.yellowCard}
            {@const player = $playerStore.find(x => x.id == prediction?.sfPrediction.yellowCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.sfPrediction.yellowCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(8)}
            class="selection-panel 
              {prediction?.sfPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.sfPrediction?.redCard}
            {@const player = $playerStore.find(x => x.id == prediction?.sfPrediction.redCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.sfPrediction.redCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">40 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2 text-sm">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 80 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 160 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 120 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-blue-900 p-2 mt-4 rounded-md text-sm">
      <div class="w-1/12 text-center">F</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(9)}
            class="selection-panel 
              {prediction?.fPrediction?.winner ? 'selected-panel' : 'select-panel '} 
              "
            > 
              {#if prediction?.fPrediction?.winner}
              {#await getFlagComponent(prediction?.fPrediction.winner) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-6 mr-1" />
                  {/if}
                {/await}
                {getTeamName(prediction.fPrediction.winner)}
              {:else}
                Select a Team
              {/if}
            </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectLoser(9)}
            class="selection-panel 
              {prediction?.fPrediction?.loser ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.fPrediction?.loser}
            {#await getFlagComponent(prediction?.fPrediction.loser) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getTeamName(prediction.fPrediction.loser)}
            {:else}
              Select a Team
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectScorer(9)}
            class="selection-panel 
              {prediction?.fPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.fPrediction?.goalScorer}
            {@const player = $playerStore.find(x => x.id == prediction?.fPrediction.goalScorer)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.fPrediction.goalScorer)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">50 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectAssister(9)}
            class="selection-panel 
              {prediction?.fPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.fPrediction?.goalAssister}
            {@const player = $playerStore.find(x => x.id == prediction?.fPrediction.goalAssister)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.fPrediction.goalAssister)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">50 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectYellowCard(9)}
            class="selection-panel 
              {prediction?.fPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.fPrediction?.yellowCard}
            {@const player = $playerStore.find(x => x.id == prediction?.fPrediction.yellowCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.fPrediction.yellowCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button
            on:click={() => selectRedCard(9)}
            class="selection-panel 
              {prediction?.fPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
              "
            >
            {#if prediction?.fPrediction?.redCard}
            {@const player = $playerStore.find(x => x.id == prediction?.fPrediction.redCard)}
            {@const teamId = player ? player.teamId : 0 }  
            {#await getFlagComponent(teamId) then FlagComponent}
                {#if FlagComponent}
                  <svelte:component this={FlagComponent} className="w-6 mr-1" />
                {/if}
              {/await}
              {getPlayerName(prediction.fPrediction.redCard)}
            {:else}
              Select a Player
            {/if}
          </button
          >
          <div class="text-right">
            <p class="text-xs mt-4">50 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2 text-sm">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 100 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 200 Points
          </p>
        </div>
        <div class="w-1/3">
          <p
            class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center"
          >
            Both Correct Bonus: 150 Points
          </p>
        </div>
      </div>
    </div>

    <div class="bg-panel rounded-md p-4 mt-4">
      <div class="flex justify-center">
        <button
          on:click={handlePredictionSubmit}
          type="submit"
          disabled={isSubmitDisabled}
          class={`${isSubmitDisabled ? "bg-gray-500" : "bg-OPENFPLPURPLE hover:bg-OPENFPL hover:text-GRAY focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"} inline-flex justify-center px-4 py-2 border border-transparent shadow-sm font-bold rounded-md text-white`}
        >
          <p class="text-xl px-4">
            Play<br /> 
            {#if !sweepstakePaid}
              <span class="text-xxs">(100 $FPL)</span>
            {/if}
          </p>
          {#if !sweepstakePaid}
            <p class="text-small">You've already paid, but can update your team until the first kick off.</p>
          {/if}
        </button>
      </div>
    </div>
  </div></Layout
>
