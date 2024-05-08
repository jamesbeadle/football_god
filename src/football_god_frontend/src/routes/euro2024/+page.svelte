<script lang="ts">
  import type {
    Euro2024PredictionDTO,
    InternationalPlayer,
    InternationalTeam,
  } from "../../../../declarations/football_god_backend/football_god_backend.did";
  import Layout from "../Layout.svelte";
  import { onMount } from "svelte";

  let teams: InternationalTeam[] = [];
  let players: InternationalPlayer[] = [];
  let prediction: Euro2024PredictionDTO | undefined;

  let canEnterSweepstake = false; // TODO Update UI to use
  let sweepstakePaid = false; // TODO Update UI to use

  const fetchPrediction = async (): Promise<
    Euro2024PredictionDTO | undefined
  > => {
    return undefined;
    // TODO: Implement fetching an existing prediction from the backend
    // If there's no existing prediction, this should return `undefined`
  };

  onMount(async () => {
    teams = await loadTeams(); // You need to define this
    players = await loadPlayers(); // You need to define this
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

  // Replace with the actual function to load teams from the backend
  async function loadTeams(): Promise<InternationalTeam[]> {
    // TODO: Load teams from the backend
    return [];
  }

  // Replace with the actual function to load players from the backend
  async function loadPlayers(): Promise<InternationalPlayer[]> {
    // TODO: Load players from the backend
    return [];
  }

  const handlePredictionSubmit = () => {
    // TODO: Submit the prediction to the backend
  };
</script>

<Layout>
  <div class="bg-panel rounded-md p-4 mt-4">
    <p class="my-4 text-xl">Welcome to the FootballGod Euro 2024 prediction game.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    
      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
          <div class="p-4 flex flex-col justify-between h-full">
            <p class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white">
              Prize Pool: 0.00 $FPL
            </p>
          </div>
      </div>
    
      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
        <div class="p-4 flex flex-col justify-between h-full">
          <p class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white">
            Total Entries: 0
          </p>
        </div>
      </div>
    
      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
          <div class="p-4 flex flex-col justify-between h-full">
            <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Leaderboard
          </button>
          </div>
      </div>
    </div>

    <p class="my-4">Make your selections below and enter the sweepstake to be in with a chance of winning $FPL:</p>
    

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-2xl">Group A</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <select id="GAWinner" class="flex-1 block w-full rounded-sm sm:text-sm bg-gray-400 p-2">
            <option value="">Select a Team</option>
            {#each teams as team}
              <option value={team}>{team}</option>
            {/each}
          </select>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <select id="GAWinner" class="flex-1 block w-full rounded-sm sm:text-sm bg-gray-400 p-2">
            <option value="">Select a Team</option>
            {#each teams as team}
              <option value={team}>{team}</option>
            {/each}
          </select>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">1</div>
        <div class="w-1/6">1</div>
        <div class="w-1/6">1</div>
        <div class="w-1/6">1</div>
      </div>
      
    </div>


    <div class="flex flex-row">
      <div class="w-1/12">
        <div class="flex-col my-4">
          <p class="mt-4">&nbsp;</p>
          <p class="mt-5">Group A</p>
          <p class="mt-14">Group B</p>
          <p class="mt-14">Group C</p>
          <p class="mt-6">Group D</p>
          <p class="mt-6">Group E</p>
          <p class="mt-6">Group F</p>
          <p class="mt-6">Bonuses</p>
          <p class="mt-6">Round of 16</p>
          <p class="mt-6">Quarter Final</p>
          <p class="mt-6">Semi Final</p>
          <p class="mt-6">Final</p>
        </div>
      </div>
      <div class="w-11/12">
        <div class="flex flex-row flex-wrap my-4">
          <div class="w-1/6">Winner</div>
          <div class="w-1/6">Loser</div>
          <div class="w-1/6">Goal Scored</div>
          <div class="w-1/6">Goal Assisted</div>
          <div class="w-1/6">Yellow Card</div>
          <div class="w-1/6">Red Card</div>
        </div>

        <div class="flex flex-row my-4 space-x-2">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">5 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">5 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">10 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">10 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">5 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">10 Points</p>
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
            <div class="text-right">
              <p class="text-xs p-1">5 Points</p>
            </div>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row my-4 space-x-2">
          <div class="w-full">
            <p class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2 text-center">
              Receive double points for each category you make 3 or more correct selections.
            </p>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row my-4 space-x-2">
          <div class="w-2/6">
            <p class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2 text-center">
              Receive double points for each category you make 3 or more correct selections.
            </p>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="flex flex-row space-x-2 my-4">
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Team</option>
              {#each teams as team}
                <option value={team}>{team}</option>
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
          <div class="w-1/6">
            <select
              id="GAWinner"
              class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm bg-gray-800 p-2"
            >
              <option value="">Select a Player</option>
              {#each players as player}
                <option value={player}
                  >{player.firstName} {player.lastName}</option
                >
              {/each}
            </select>
          </div>
        </div>

        <div class="py-3 text-right">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Predictions
          </button>

          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 opacity-50 cursor-not-allowed"
          >
            Submit & Enter Sweepstake (100 $FPL)
          </button>
          <p class="text-sm my-4">95% of your entry is used for the prize pool, 5% is burned.</p>
        </div>
      </div>
    </div>
  </div>
</Layout>
