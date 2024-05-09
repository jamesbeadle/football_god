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

  function selectWinner(stage: number){

  };
  function selectLoser(stage: number){

  };
  function selectScorer(stage: number){

  };
  function selectAssister(stage: number){

  };
  function selectYellowCard(stage: number){

  };
  function selectRedCard(stage: number){

  };
</script>

<Layout>
  <div class="bg-panel rounded-md p-4 mt-4">
    <p class="my-4 text-xl">Welcome to the FootballGod Euro 2024 prediction game.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    
      <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
          <div class="p-4 flex flex-col justify-between h-full">
            
            <p class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-bold rounded-md text-white items-center">
              <img src="FPLCoin.png" alt="fpl" class="w-8 h-8 mr-2 mb-1" />
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
    
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          Winner
        </div>
        <div class="w-1/6">
          Loser
        </div>
        <div class="w-1/6">
          To Score
        </div>
        <div class="w-1/6">
          To Assist
        </div>
        <div class="w-1/6">
          Yellow Card
        </div>
        <div class="w-1/6">
          Red Card
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group A</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(0)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group B</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(1)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group C</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(2)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group D</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(3)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group E</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(4)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Group F</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">5 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(5)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
      </div>
    </div>

    
    <div class="flex flex-row my-4 space-x-2">
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-full">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Receive double points for each group stage category you make 3 or more correct selections.
          </p>
        </div>
      </div>
    </div>

    
    <div class="flex flex-row items-center bg-gray-800 p-4">
    
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          Winner
        </div>
        <div class="w-1/6">
          Loser
        </div>
        <div class="w-1/6">
          To Score
        </div>
        <div class="w-1/6">
          To Assist
        </div>
        <div class="w-1/6">
          Yellow Card
        </div>
        <div class="w-1/6">
          Red Card
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Round of 16</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(6)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">20 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2">
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 40 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 80 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 60 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Quarter Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">30 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">30 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">15 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(7)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">30 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2">
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 60 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 120 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 90 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Semi Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">20 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">40 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">40 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">10 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(8)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">40 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2">
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 80 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 160 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 120 Points
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center bg-gray-800 p-4">
      <div class="w-1/12 text-lg">Final</div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/6">
          <button on:click={() => selectWinner(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectLoser(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Team</button>
          <div class="text-right">
            <p class="text-xs mt-1">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectScorer(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">50 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectAssister(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">50 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectYellowCard(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">25 Points</p>
          </div>
        </div>
        <div class="w-1/6">
          <button on:click={() => selectRedCard(9)} class="flex-1 block w-full rounded-sm sm:text-sm shadow-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2">Select a Player</button>
          <div class="text-right">
            <p class="text-xs mt-1">50 Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-2">
      <div class="w-1/12 text-lg"></div>
      <div class="w-11/12 flex flex-row space-x-4">
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 100 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 200 Points
          </p>
        </div>
        <div class="w-1/3">
          <p class="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 p-2 text-center">
            Both Correct Bonus: 150 Points
          </p>
        </div>
      </div>
    </div>


  </div>
</Layout>
