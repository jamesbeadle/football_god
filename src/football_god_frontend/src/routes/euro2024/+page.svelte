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
  import OpenChatIcon from "$lib/icons/OpenChatIcon.svelte";
  import { Collapsible, Spinner } from "@dfinity/gix-components";
  import ConfirmSelectionModal from "$lib/components/euro2024/confirm-selection-modal.svelte";
  import { euro2024Store } from "$lib/stores/euro2024.store";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import { authStore, type AuthSignInParams } from "$lib/stores/auth.store";
 
  let prediction: Euro2024PredictionDTO | undefined;

  let selectedStage = -1;
  let predictionType = -1;
  let showSelectTeamModal = false;
  let showSelectPlayerModal = false;
  let interval: NodeJS.Timeout;
  let showConfirmSubmit = false;
  let isLoading = true;
  let loadingPot = true;
  let sliderStage = 0;
  $: potBalance = 0;
  $: loadingText = "Loading, please wait...";

  let dots = writable('.');
  let dot_interval;


  const countdown = writable("");

  const groupStageTeams = [
    [10, 17, 11, 22],
    [21, 4, 12, 1],
    [20, 6, 18, 7],
    [14, 13, 2, 8],
    [3, 19, 16, 24],
    [23, 9, 15, 5]
  ];

  const fetchPrediction = async (): Promise<Euro2024PredictionDTO | undefined> => {    
    return userStore.getUserPrediction();
  };

  onMount(async () => {
    await authStore.sync();


    await teamStore.sync();
    await playerStore.sync();
    loadingText = "Fetching Prediction";
    await userStore.sync();
    await euro2024Store.sync();
    if($teamStore.length == 0 || $playerStore.length == 0){
      return;
    };

    prediction = await fetchPrediction();

    if (!prediction) {
      prediction = {
        alreadyEntered: false,
        entryTime : 0n,
        totalScore : 0,
        principalId : "",
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
    isLoading = false;
    
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
    
    await setPotBalance();
    
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  async function setPotBalance(){
    loadingPot = true;
    let count = 1;
    dot_interval = setInterval(() => {
      count = (count % 3) + 1;
      dots.set('.'.repeat(count));
    }, 500);
    if(euro2024Store){
      let pot = Number(await euro2024Store.getPotBalance());
      let prizePool = pot * 0.8 / 100_000_000;
      potBalance = prizePool;
    }
    loadingPot = false;
    clearInterval(dot_interval);
  }

  async function handlePredictionSubmit() {
    isLoading = true;
    loadingText = "Saving Prediction";
    if(!prediction){
      return;
    };

    if(prediction.alreadyEntered){
      let dto: Euro2024PredictionDTO = {
        'alreadyEntered' : prediction?.alreadyEntered,
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
        'entryTime' : prediction?.entryTime,
        'totalScore' : prediction?.totalScore,
        'principalId' : prediction?.principalId
      };
      return await savePrediction(dto);
    }

    showConfirmSubmit = true;
    isLoading = false;
  };

  async function confirmSavePrediction(){
    isLoading = true;
    loadingText = "Saving Prediction";
    
    if(!prediction){
      return;
    };

    let dto: Euro2024PredictionDTO = {
      'alreadyEntered' : prediction?.alreadyEntered,
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
      'entryTime' : prediction?.entryTime,
      'totalScore' : prediction?.totalScore,
      'principalId' : prediction?.principalId
    };

    await savePrediction(dto);

    showConfirmSubmit = false;
  }

  async function savePrediction(dto: Euro2024PredictionDTO) {
    try {
      let result = await userStore.saveEuro2024Predictions(dto);
      if (isError(result)) {
        toastsError({
          msg: { text: "Error saving prediction on football god backend." },
          err: null,
        });
        console.error("Error saving prediction on football god backend", null);
      } 

      prediction = {
        ...prediction!,
        alreadyEntered: true,
      };
      
      toastsShow({
        text: "Euro 2024 prediction saved.",
        level: "success",
        duration: 2000,
      });

      await setPotBalance();
      await euro2024Store.sync();
    } catch (error) {
      toastsError({
        msg: { text: "Error saving Euro 2024 prediction." },
        err: error,
      });
      console.error("Error saving Euro 2024 prediction", error);
    } finally {
      isLoading = false;
    }
  }

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

  function closeConfirmSelectionModal(){
    showConfirmSubmit = false;
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
        return (await import('$lib/components/flags/ned.svelte')).default as typeof SvelteComponent;
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

  function nextStage() {
    if(sliderStage == 9){
      return;
    }
    sliderStage++;
  }

  function priorStage() {
    if(sliderStage == 0){
      return;
    }
    sliderStage--;
  }


  function handleLogin() {
    let params: AuthSignInParams = {
      domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
    };
    authStore.signIn(params);
  }

</script>

<Layout>

  {#if !$authSignedInStore}
  


    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
      <div
        class="bg-cover bg-center bg-no-repeat py-20 px-4"
        style="background-image: url('banner.jpg');"
      >
        <div class="container ml-4 flex flex-col justify-between">
          <p class="text-xl">$FPL Prediction Sweepstake</p>
          <p class="text-4xl font-bold">Euro 2024</p>
          <p class="text-xl">
            Play for free or enter the $FPL sweepstake up until Friday 14th June
            2024
          </p>
          {#if $authSignedInStore}
          <a href="/euro2024"
            ><button class="btn bg-DARK mt-4 py-4 w-48 rounded-md"
              >Enter Now</button
            ></a
          >
          {:else}
            
          <button on:click={handleLogin} class="btn bg-DARK mt-4 py-4 w-48 rounded-md">Connect To Play</button
        >
          {/if}
          
        </div>
      </div>
    </div>






  {:else}

    {#if isLoading}
      <Spinner />
      <div class="fixed inset-0 flex flex-col items-center justify-center">
        <p class="mt-24">{loadingText}</p>
      </div>
    {:else}

      {#if showConfirmSubmit}
        <ConfirmSelectionModal confirmSubmit={confirmSavePrediction} visible={showConfirmSubmit} closeSelectionModal={closeConfirmSelectionModal} />
      {/if}
      
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
        <p class="text-sm md:text-xl my-2 mb-4">
          Welcome to the FootballGod Euro 2024 prediction game.
        </p>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 text-xs md:text-base">
          <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
            <div class="p-2 flex flex-col justify-between h-full">
              <p
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white items-center"
              >
                <img src="FPLCoin.png" alt="fpl" class="w-8 h-8 mr-2 mb-1" />
                Prize Pool:
                {#if loadingPot}
                  <div class="dot-animation min-w-[20px] text-center">{$dots}</div>
                {:else}
                  {potBalance.toFixed(0)} $FPL
                {/if}
              </p>
            </div>
          </div>

          <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
            <div class="flex flex-col justify-center h-full">
              <p
                class="inline-flex justify-center py-2 px-4 mx-2 border border-transparent shadow-sm font-bold rounded-md text-white"
              >
                Total Entries: {$euro2024Store ? $euro2024Store.totalManagers : 0}
              </p>
            </div>
          </div>

          <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
            <div class="flex flex-col justify-center h-full">
              <p
                class="inline-flex justify-center py-2 px-4 mx-2 border border-transparent shadow-sm font-bold rounded-md text-white"
              >{$countdown}</p>
            </div>
          </div>
        </div>

        <div class="horizontal-divider my-4" />
        <div class="flex flex-col md:flex-row text-xs md:text-base">
          <div class="w-full md:w-4/6 flex flex-col">
            <p class="md:my-4 inline-flex">
              Entry Fee: 100 $FPL
            </p>

            <p class="md:my-4 inline-flex">
              Total FPL to be burned:
              {#if loadingPot}
                <div class="dot-animation min-w-[20px] text-center">{$dots}</div>
              {:else}
                {(potBalance / 4).toFixed(0)} $FPL
              {/if}
            </p>
          </div>
          <div class="w-full md:w-2/6 flex items-center mt-4 md:mt-0">
            <a class="w-full flex" href="https://oc.app/community/ji74r-lqaaa-aaaar-ayhoq-cai/?ref=zv6hh-xaaaa-aaaar-ac35q-cai" target="_blank">
              <button class="w-full ml-1 fg-button px-4 py-2 rounded-md my-2 flex items-center space-x-2">
                <OpenChatIcon className="w-8 md:w-24 lg:w-16" />
                <p class="text-left text-xs md:text-sm">Join our OpenChat Community now!</p>
              </button>
            </a>
          </div>
        </div>
        
        

        <div class="horizontal-divider my-4" />

        <Collapsible iconSize="medium">
          <div slot="header">How To Play, Rules & Prizes</div>
          <p class="text-sm my-4">
            For each group stage and knockout round you need to make 6 selections.
            For the group stage you predict the winner and loser of a group. 
            You can then predict any player from the teams in that group to either score, assist, get a yellow card or a red.
            The knockout stage is very similar to the group stage but you can pick from any team as anyone can reach the knockout stage.
          </p>
          <p class="text-sm my-4">
            When the game starts a leaderboard will be active throughout the tournament, updated shortly after a game finishes. 
            At the end of the tournament the leaderboard will pay the top 10 players the prize pool. It will be split as follows:
          </p>
          <ul class="text-sm mt-4">
            <li>1st: 30%</li>
            <li>2nd: 20%</li>
            <li>3rd: 15%</li>
            <li>4th: 10%</li>
            <li>5th: 7%</li>
            <li>6th: 6%</li>
            <li>7th: 5%</li>
            <li>8th: 3%</li>
            <li>9th: 2%</li>
            <li>10th: 1%</li>
          </ul>
          <p class="text-sm mt-4">The prize pool & total FPL burned is rounded to the nearest whole number of FPL tokens. 20% of the total FPL entered will be burned after the competition.</p>
        </Collapsible>

        <div class="horizontal-divider mt-4" />
        
        <p class="text-sm my-4">
          Make your selections below and enter the sweepstake to be in with a chance
          of winning $FPL.
        </p>
        
        <div id="mobile-wrapper" class="md:hidden">
          
          {#if sliderStage == 0}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              <div class="my-4 flex flex-row items-center w-full">
                <button disabled={true} class="bg-GRAY text-white px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group A</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>

              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupAPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectLoser(0)}
                  class="selection-panel 
                    {prediction?.groupAPrediction?.loser ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupAPrediction?.loser}
                      {#await getFlagComponent(prediction?.groupAPrediction.loser) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupAPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(0)}
                  class="selection-panel 
                    {prediction?.groupAPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupAPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupAPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupAPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(0)}
                  class="selection-panel 
                    {prediction?.groupAPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupAPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupAPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupAPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(0)}
                  class="selection-panel 
                    {prediction?.groupAPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupAPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupAPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupAPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(0)}
                  class="selection-panel 
                    {prediction?.groupAPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupAPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupAPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupAPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>



            </div>
          {/if}

          {#if sliderStage == 1}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group B</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupBPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupBPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(1)}
                  class="selection-panel 
                    {prediction?.groupBPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupBPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupBPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupBPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(1)}
                  class="selection-panel 
                    {prediction?.groupBPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupBPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupBPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupBPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(1)}
                  class="selection-panel 
                    {prediction?.groupBPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupBPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupBPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupBPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(1)}
                  class="selection-panel 
                    {prediction?.groupBPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupBPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupBPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupBPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>



            </div>
          {/if}

          {#if sliderStage == 2}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group C</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupCPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupCPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(2)}
                  class="selection-panel 
                    {prediction?.groupCPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupCPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupCPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupCPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(2)}
                  class="selection-panel 
                    {prediction?.groupCPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupCPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupCPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupCPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(2)}
                  class="selection-panel 
                    {prediction?.groupCPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupCPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupCPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupCPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(2)}
                  class="selection-panel 
                    {prediction?.groupCPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupCPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupCPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupCPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>



            </div>
          {/if}

          {#if sliderStage == 3}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group D</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupDPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupDPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(3)}
                  class="selection-panel 
                    {prediction?.groupDPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupDPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupDPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupDPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(3)}
                  class="selection-panel 
                    {prediction?.groupDPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupDPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupDPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupDPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(3)}
                  class="selection-panel 
                    {prediction?.groupDPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupDPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupDPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupDPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(3)}
                  class="selection-panel 
                    {prediction?.groupDPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupDPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupDPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupDPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>



            </div>
          {/if}

          {#if sliderStage == 4}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group E</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupEPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupEPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(4)}
                  class="selection-panel 
                    {prediction?.groupEPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupEPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupEPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupEPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(4)}
                  class="selection-panel 
                    {prediction?.groupEPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupEPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupEPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupEPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(4)}
                  class="selection-panel 
                    {prediction?.groupEPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupEPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupEPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupEPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(4)}
                  class="selection-panel 
                    {prediction?.groupEPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupEPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupEPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupEPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>



            </div>
          {/if}

          {#if sliderStage == 5}
            <div class="flex flex-col bg-gray-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Group F</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupFPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupFPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(5)}
                  class="selection-panel 
                    {prediction?.groupFPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupFPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.groupFPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupFPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(5)}
                  class="selection-panel 
                    {prediction?.groupFPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupFPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.groupFPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupFPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(5)}
                  class="selection-panel 
                    {prediction?.groupFPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupFPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.groupFPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupFPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">5 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(5)}
                  class="selection-panel 
                    {prediction?.groupFPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.groupFPrediction?.redCard}
                      {#await getFlagComponent(prediction?.groupFPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.groupFPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>
            </div>
          {/if}

          {#if sliderStage < 6}


          <p
          class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2"
        >
          If you make 3 or more correct selections within the same category across all 6 groups, you will receive double points for that category.
        </p>
          {/if}

          {#if sliderStage == 6}
            <div class="flex flex-col bg-blue-600 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Round of 16</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.r16Prediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.r16Prediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 40 point bonus if you select both a winner and loser from the round of 16.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(6)}
                  class="selection-panel 
                    {prediction?.r16Prediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.r16Prediction?.goalScorer}
                      {#await getFlagComponent(prediction?.r16Prediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.r16Prediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(6)}
                  class="selection-panel 
                    {prediction?.r16Prediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.r16Prediction?.goalAssister}
                      {#await getFlagComponent(prediction?.r16Prediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.r16Prediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive an 80 point bonus if you select both a goalscorer and a player to get an assist from the round of 16.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(6)}
                  class="selection-panel 
                    {prediction?.r16Prediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.r16Prediction?.yellowCard}
                      {#await getFlagComponent(prediction?.r16Prediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.r16Prediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">10 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(6)}
                  class="selection-panel 
                    {prediction?.r16Prediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.r16Prediction?.redCard}
                      {#await getFlagComponent(prediction?.r16Prediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.r16Prediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 60 point bonus if you select a player to get a yellow card and a player to get a red card from the round of 16.
              </p>



            </div>
          {/if}

          {#if sliderStage == 7}
            <div class="flex flex-col bg-blue-700 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Quarter Final</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.qfPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">15 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.qfPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">15 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 60 point bonus if you select both a winner and loser from the quarter final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(7)}
                  class="selection-panel 
                    {prediction?.qfPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.qfPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.qfPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.qfPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">30 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(7)}
                  class="selection-panel 
                    {prediction?.qfPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.qfPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.qfPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.qfPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">30 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive an 120 point bonus if you select both a goalscorer and a player to get an assist from the quarter final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(7)}
                  class="selection-panel 
                    {prediction?.qfPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.qfPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.qfPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.qfPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">15 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(7)}
                  class="selection-panel 
                    {prediction?.qfPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.qfPrediction?.redCard}
                      {#await getFlagComponent(prediction?.qfPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.qfPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">30 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 90 point bonus if you select a player to get a yellow card and a player to get a red card from the quarter final.
              </p>



            </div>
          {/if}

          {#if sliderStage == 8}
            <div class="flex flex-col bg-blue-800 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Semi Final</div>
                <button on:click={nextStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.sfPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.sfPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 80 point bonus if you select both a winner and loser from the semi final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(8)}
                  class="selection-panel 
                    {prediction?.sfPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.sfPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.sfPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.sfPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">40 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(8)}
                  class="selection-panel 
                    {prediction?.sfPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.sfPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.sfPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.sfPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">40 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive an 160 point bonus if you select both a goalscorer and a player to get an assist from the semi final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(8)}
                  class="selection-panel 
                    {prediction?.sfPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.sfPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.sfPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.sfPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">20 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(8)}
                  class="selection-panel 
                    {prediction?.sfPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.sfPrediction?.redCard}
                      {#await getFlagComponent(prediction?.sfPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.sfPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">40 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 120 point bonus if you select a player to get a yellow card and a player to get a red card from the semi final.
              </p>



            </div>
          {/if}

          {#if sliderStage == 9}
            <div class="flex flex-col bg-blue-900 p-2 mt-4 rounded-md text-sm">
              
              <div class="my-4 flex flex-row items-center w-full">
                <button on:click={priorStage} class="bg-OPENFPL text-GRAY px-4 py-2 rounded-sm text-2xl">&lt;</button>
                <div class="flex-grow text-center">Final</div>
                <button on:click={nextStage} class="bg-GRAY text-white px-4 py-2 rounded-sm text-2xl">&gt;</button>
              </div>


              <div>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.fPrediction.winner)}
                      </span>
                    {:else}
                      Select Winner
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">25 Points</p>
                </div>
              </div>

              <div class="mt-4">
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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.fPrediction.loser)}
                      </span>
                    {:else}
                      Select Loser
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">25 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 100 point bonus if you select both a winner and loser from the final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectScorer(9)}
                  class="selection-panel 
                    {prediction?.fPrediction?.goalScorer ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.fPrediction?.goalScorer}
                      {#await getFlagComponent(prediction?.fPrediction.goalScorer) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.fPrediction.goalScorer)}
                      </span>
                    {:else}
                      Select Goal Scorer
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">50 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectAssister(9)}
                  class="selection-panel 
                    {prediction?.fPrediction?.goalAssister ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.fPrediction?.goalAssister}
                      {#await getFlagComponent(prediction?.fPrediction.goalAssister) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.fPrediction.goalAssister)}
                      </span>
                    {:else}
                      Select Goal Assister
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">50 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive an 200 point bonus if you select both a goalscorer and a player to get an assist from the final.
              </p>

              <div class="mt-4">
                <button
                  on:click={() => selectYellowCard(9)}
                  class="selection-panel 
                    {prediction?.fPrediction?.yellowCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.fPrediction?.yellowCard}
                      {#await getFlagComponent(prediction?.fPrediction.yellowCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.fPrediction.yellowCard)}
                      </span>
                    {:else}
                      Select Yellow Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">25 Points</p>
                </div>
              </div>

              <div class="mt-4">
                <button
                  on:click={() => selectRedCard(9)}
                  class="selection-panel 
                    {prediction?.fPrediction?.redCard ? 'selected-panel' : 'select-panel '} 
                    "
                  >
                    {#if prediction?.fPrediction?.redCard}
                      {#await getFlagComponent(prediction?.fPrediction.redCard) then FlagComponent}
                        {#if FlagComponent}
                          <svelte:component this={FlagComponent} className="w-6 mr-1" />
                        {/if}
                      {/await}
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getPlayerName(prediction.fPrediction.redCard)}
                      </span>
                    {:else}
                      Select Red Card
                    {/if}
                  </button
                >
                <div class="text-right">
                  <p class="text-xs mt-4">50 Points</p>
                </div>
              </div>

              <p class="flex-1 block w-full rounded-none rounded-md bg-gray-800 p-2 text-center text-xs mt-2">
                Receive a 150 point bonus if you select a player to get a yellow card and a player to get a red card from the final.
              </p>



            </div>
          {/if}





          
        </div>

        <div id="dektop-wrapper" class="hidden md:flex flex-col">


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
                      <span class="truncate whitespace-nowrap overflow-hidden">
                        {getTeamName(prediction.groupAPrediction.winner)}
                      </span>
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
    
                    <span class="truncate whitespace-nowrap overflow-hidden">
                      {getTeamName(prediction.groupAPrediction.loser)}
                    </span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupAPrediction.goalScorer)}</span>
                    
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupAPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupAPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupAPrediction.redCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupBPrediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupBPrediction.loser)}</span>
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
                  <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupBPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupBPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupBPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupBPrediction.redCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupCPrediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupCPrediction.loser)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupCPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupCPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupCPrediction.yellowCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupCPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupDPrediction.winner)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupDPrediction.loser)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupDPrediction.goalScorer)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupDPrediction.goalAssister)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupDPrediction.yellowCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupDPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupEPrediction.winner)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupEPrediction.loser)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupEPrediction.goalScorer)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupEPrediction.goalAssister)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupEPrediction.yellowCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupEPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupFPrediction.winner)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.groupFPrediction.loser)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupFPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupFPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupFPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.groupFPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.r16Prediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.r16Prediction.loser)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.r16Prediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.r16Prediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.r16Prediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.r16Prediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.qfPrediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.qfPrediction.loser)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.qfPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.qfPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.qfPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.qfPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.sfPrediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.sfPrediction.loser)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.sfPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.sfPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.sfPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.sfPrediction.redCard)}</span>
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
                      <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.fPrediction.winner)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getTeamName(prediction.fPrediction.loser)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.fPrediction.goalScorer)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.fPrediction.goalAssister)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.fPrediction.yellowCard)}</span>
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
                    <span class="truncate whitespace-nowrap overflow-hidden">{getPlayerName(prediction.fPrediction.redCard)}</span>
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



        </div>

        <div class="bg-panel rounded-md p-4 mt-4">
          <div class="flex justify-center">
            <button
              on:click={handlePredictionSubmit}
              type="submit"
              class="bg-OPENFPLPURPLE hover:bg-OPENFPL hover:text-GRAY focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex justify-center px-4 py-2 border border-transparent shadow-sm font-bold rounded-md text-white"
            >
              <p class="text-xl px-4">
                Save<br /> 
              </p>
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}

</Layout>
