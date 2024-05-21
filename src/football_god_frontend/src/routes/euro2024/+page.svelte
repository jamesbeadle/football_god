<script lang="ts">
  import type {
    Euro2024PredictionDTO,
    InternationalPlayer,
    InternationalTeam,
  } from "../../../../declarations/football_god_backend/football_god_backend.did";
  import Layout from "../Layout.svelte";
  import { onMount } from "svelte";
  import SelectTeamComponent from "$lib/components/euro2024/select-team-modal.svelte";
  import SelectPlayerComponent from "$lib/components/euro2024/select-player-modal.svelte";
  import { teamStore } from "$lib/stores/teams.store";
  import { playerStore } from "$lib/stores/player.store";

  let teams: InternationalTeam[] = [];
  let players: InternationalPlayer[] = [];
  let prediction: Euro2024PredictionDTO | undefined;

  let canEnterSweepstake = false; // TODO Update UI to use
  let sweepstakePaid = false; // TODO Update UI to use

  let selectedStage = -1;
  let predictionType = -1;
  let showSelectTeamModal = false;
  let showSelectPlayerModal = false;

  const fetchPrediction = async (): Promise<
    Euro2024PredictionDTO | undefined
  > => {
    return undefined;
    // TODO: Implement fetching an existing prediction from the backend
    // If there's no existing prediction, this should return `undefined`
  };

  onMount(async () => {
    
    await teamStore.sync();
    await playerStore.sync();
    if($teamStore.length == 0 || $playerStore.length == 0){
      return;
    };

    prediction = await fetchPrediction();

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
  });

  const handlePredictionSubmit = () => {
    // TODO: Submit the prediction to the backend
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
    return player ? player.lastName : "Select a Player";
  }

</script>

<Layout>
  {#if showSelectPlayerModal}
    <SelectPlayerComponent
      {confirmPlayerSelection}
      visible={showSelectPlayerModal}
      {closePlayerSelectionModal}
     />
  {/if}

  {#if showSelectTeamModal}
    <SelectTeamComponent
      {confirmTeamSelection}
      visible={showSelectTeamModal}
      {closeTeamSelectionModal}
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
          <a href="/leaderboard" class="inline-flex">
            <button
              type="submit"
              class="w-full justify-center py-2 px-4 mx-2 border border-transparent shadow-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Leaderboard
            </button>
          </a>
        </div>
      </div>
    </div>

    <p class="my-4">
      Make your selections below and enter the sweepstake to be in with a chance
      of winning $FPL.
    </p>

    <div class="horizontal-divider my-4 mb-8" />

    <div class="flex flex-row items-center bg-black border rounded-md p-4 m-4">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Winner</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Loser</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">To Score</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">To Assist</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Yellow Card</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Red Card</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-400 p-4 m-4 rounded-md">
      <div class="w-1/12">Group A</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(0)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.winner}
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
          <button
            on:click={() => selectLoser(0)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.loser}
                {getTeamName(prediction.groupAPrediction.loser)}
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
            on:click={() => selectScorer(0)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupAPrediction?.redCard}
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

    <div class="flex flex-row items-center bg-gray-500 p-4 m-4 rounded-md">
      <div class="w-1/12">Group B</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(1)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupBPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupBPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.groupBPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupBPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupBPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupBPrediction?.redCard}
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

    <div class="flex flex-row items-center bg-gray-400 p-4 m-4 rounded-md">
      <div class="w-1/12">Group C</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(2)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupCPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            > 
              {#if prediction?.groupCPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            > 
              {#if prediction?.groupCPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupCPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupCPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupCPrediction?.redCard}
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

    <div class="flex flex-row items-center bg-gray-500 p-4 m-4 rounded-md">
      <div class="w-1/12">Group D</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(3)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupDPrediction?.redCard}
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

    <div class="flex flex-row items-center bg-gray-400 p-4 m-4 rounded-md">
      <div class="w-1/12">Group E</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(4)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupEPrediction?.redCard}
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

    <div class="flex flex-row items-center bg-gray-500 p-4 m-4 rounded-md">
      <div class="w-1/12">Group F</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(5)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupFPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupFPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.groupFPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.groupFPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.groupFPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.groupFPrediction?.redCard}
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

    <div class="flex flex-row my-4 space-x-2">
      <div class="w-full mx-4">
        <p class="flex-1 block w-full bg-gray-800 p-2 text-center rounded-md">
          Receive double points for each group stage category you make 3 or more
          correct selections.
        </p>
      </div>
    </div>

    <div class="horizontal-divider my-8" />

    <div class="flex flex-row items-center bg-black border rounded-md p-4 m-4">
      <div class="w-1/12" />
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Winner</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Loser</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">To Score</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">To Assist</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Yellow Card</p>
        </div>
        <div class="w-1/6 flex">
          <p class="w-full text-center border-x">Red Card</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-green-700 p-4">
      <div class="w-1/12">Round of 16</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(6)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.r16Prediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.r16Prediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.r16Prediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.r16Prediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.r16Prediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.r16Prediction?.redCard}
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

    <div class="flex flex-row my-4 space-x-2">
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

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12">Quarter Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(7)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.qfPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.qfPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.qfPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.qfPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.qfPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.qfPrediction?.redCard}
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

    <div class="flex flex-row my-4 space-x-2">
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

    <div class="flex flex-row items-center bg-gray-900 p-4">
      <div class="w-1/12">Semi Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(8)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
              {#if prediction?.sfPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.sfPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.sfPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.sfPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.sfPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.sfPrediction?.redCard}
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

    <div class="flex flex-row my-4 space-x-2">
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

    <div class="flex flex-row items-center bg-yellow-600 p-4">
      <div class="w-1/12">Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button
            on:click={() => selectWinner(9)}
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            > 
              {#if prediction?.fPrediction?.winner}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.fPrediction?.loser}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.fPrediction?.goalScorer}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.fPrediction?.goalAssister}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.fPrediction?.yellowCard}
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
            class="flex-1 block w-full rounded-md sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2"
            >
            {#if prediction?.fPrediction?.redCard}
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

    <div class="flex flex-row my-4 space-x-2">
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
          type="submit"
          class="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <p class="text-xl px-4">
            Play<br /> <span class="text-xxs">(100 $FPL)</span>
          </p>
        </button>
      </div>
    </div>
  </div></Layout
>
