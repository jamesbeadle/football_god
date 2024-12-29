<script lang="ts">
    import OpenFPLIcon from "../../icons/OpenFPLIcon.svelte";
    import EmptyBetSlipIcon from "$lib/icons/EmptyBetSlipIcon.svelte";
    import { betSlipStore } from "$lib/stores/bet-slip-store";
  
    export let isExpanded: boolean = false;
  
    let isMultiple = false;
    let stakes: Record<number, number> = {};
    let multipleStake = 0;

    $: bets = $betSlipStore;
  
    $: totalStakes = isMultiple 
      ? multipleStake 
      : Object.values(stakes).reduce((total, stake) => total + (stake || 0), 0);

    let totalReturns = 0;
    
    function calculateReturns(stake: number, odds: number): number {
      return stake * odds;
    }

    function removeBet(index: number) {
      const bet = bets[index];
      betSlipStore.removeBet(bet.leagueId, bet.fixtureId, bet.selectionType, bet.selectionDetail);
      delete stakes[index]; 
    }


  </script>
  
  {#if isExpanded}
    <div class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>
  {/if}
  
  
<div
class="flex flex-col h-[95vh] mx-2 md:h-screen md:mx-0 overflow-hidden bg-white border rounded-2xl md:rounded-xl
       {isExpanded ? 'fixed inset-x-0 top-[2.5vh] z-50 w-auto md:relative md:inset-auto md:w-80 md:rounded-lg' : 'w-80'}"
>
<div class="flex items-center justify-between p-4 border-b border-gray-100 md:px-4 md:py-2 md:bg-gray-100">
  <div class="flex items-center">
    <span class="flex items-center justify-center w-8 text-lg font-medium text-white rounded-full h-7 bg-BrandPurple">
      {bets.length}
    </span>
    <span class="px-3 text-xl font-bold text-black">Bet Slip</span>
  </div>
  {#if isExpanded}
    <button
      class="text-2xl text-gray-400 hover:text-gray-600 md:hidden"
      on:click={() => (isExpanded = false)}
    >
      ×
    </button>
  {/if}
</div>

<div class="flex flex-col flex-1 overflow-auto">
  {#if bets.length === 0}
    <div class="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
      <div class="w-24 h-24 mb-4">
        <EmptyBetSlipIcon className="w-24 h-24 fill-BrandPurple" />
      </div>
      <p class="text-lg text-gray-400 md:text-sm">
        There are no selections in<br />your bet slip.
      </p>
    </div>
  {:else}
    <div class="flex items-center px-4 py-2 mt-2 rounded bg-BrandPurple">
      <span class="text-white">{isMultiple ? 'Multiple Bet' : `${bets.length} Single${bets.length > 1 ? 's' : ''}`}</span>
    </div>

    <div class="flex-1 p-4 space-y-2">
      {#each bets as bet, index}
        <div class="p-2 rounded border border-gray-300 flex flex-col gap-2">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-black font-medium">
                { bet.uiDescription }
              </p>
              <p class="text-xs text-gray-500">League: {bet.leagueId}, Fixture: {bet.fixtureId}</p>
            </div>
            <button
              class="text-gray-400 hover:text-red-500"
              on:click={() => removeBet(index)}
            >
              &times;
            </button>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">
              @ {bet.odds.toFixed(2)}
            </span>
            {#if !isMultiple}
              <input
                type="number"
                min="0"
                placeholder="Stake"
                class="text-sm w-20 p-1 border rounded"
                bind:value={stakes[index]}
              />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="p-6 mt-auto border-t border-gray-100 md:p-4 md:bg-gray-100">
    <div class="flex items-center justify-between mb-4">
      <span class="text-lg text-gray-500 md:text-sm">FPL Balance:</span>
      <div class="flex items-center space-x-3">
        <span class="flex items-center text-lg font-medium text-black md:text-sm">
          <OpenFPLIcon className="w-3 h-3 mr-1" />
          0.0000
        </span>
        <button class="px-4 py-1.5 md:px-2 md:py-1 text-sm md:text-xs text-white rounded-full bg-BrandPurple">
          Deposit
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <span class="text-lg text-gray-500 md:text-sm">Bet Total:</span>
      <span class="flex items-center text-lg font-medium text-black md:text-sm">
        <OpenFPLIcon className="w-3 h-3 mr-1" />
        {totalStakes.toFixed(2)}
      </span>
    </div>

    <div class="flex items-center justify-between mb-6 md:mb-4">
      <span class="text-lg text-gray-500 md:text-sm">Potential Returns:</span>
      <span class="flex items-center text-lg font-medium text-black md:text-sm">
        <OpenFPLIcon className="w-3 h-3 mr-1" fill="black" />
        {totalReturns.toFixed(2)}
      </span>
    </div>

    <button
      class="w-full px-4 py-4 text-lg font-medium text-white rounded-xl md:py-2 md:text-sm bg-BrandPurple hover:bg-BrandPurpleHover disabled:opacity-50 disabled:bg-gray-300"
      disabled={totalStakes <= 0 || bets.length === 0}
    >
      Place Bet
    </button>
  </div>
</div>
</div>
  