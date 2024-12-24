<script lang="ts">
  import EmptyBetSlip from "../../icons/EmptyBetSlip.svelte";
  import OpenFPLIcon from "../../icons/OpenFPLIcon.svelte";
  import type { BetSelection } from "$lib/types/betting";
  
  export let selectedBets: BetSelection[] = [];
  export let isExpanded = false;
  export let onBetsUpdate: (bets: BetSelection[]) => void = () => {};
  let isMultiple = false;
  let stakes: Record<number, number> = {};
  let multipleStake = 0;

  function removeBet(index: number) {
      const updatedBets = selectedBets.filter((_, i) => i !== index);
      delete stakes[index];
      onBetsUpdate(updatedBets);
  }

  $: totalStakes = isMultiple 
    ? multipleStake 
    : Object.values(stakes).reduce((total, stake) => total + (stake || 0), 0);

  $: totalReturns = isMultiple
    ? multipleReturns
    : Object.entries(stakes).reduce((total, [index, stake]) => 
        total + calculateReturns(stake || 0, selectedBets[Number(index)].odds), 0);

  $: {
    selectedBets.forEach((_, index) => {
      if (!(index in stakes)) {
        stakes[index] = 0;
      }
    });
  }

  function calculateReturns(stake: number, odds: number): number {
    return stake * odds;
  }

  $: multipleReturns = selectedBets.length > 0 
    ? multipleStake * selectedBets.reduce((acc, bet) => acc * bet.odds, 1)
    : 0;
</script>

{#if isExpanded}
  <div class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>
{/if}
<div class="flex flex-col h-[95vh] mx-2 md:h-screen md:mx-0 overflow-hidden bg-white border rounded-2xl md:rounded-xl {isExpanded ? 'fixed inset-x-0 top-[2.5vh] z-50 w-auto md:relative md:inset-auto md:w-80 md:rounded-lg' : 'w-80'}">
  <div class="flex items-center justify-between p-4 border-b border-gray-100 md:px-4 md:py-2 md:bg-gray-100">
    <div class="flex items-center">
      <span class="flex items-center justify-center w-8 text-lg font-medium text-white rounded-full h-7 bg-BrandPurple">
        {selectedBets.length}
      </span>
      <span class="px-3 text-xl font-bold text-black">Bet Slip</span>
    </div>
    {#if isExpanded}
      <button 
        class="text-2xl text-gray-400 hover:text-gray-600 md:hidden" 
        on:click={() => isExpanded = false}
      >
        ×
      </button>
    {/if}
  </div>
  <div class="flex flex-col flex-1 overflow-auto">
    {#if selectedBets.length === 0}
      <div class="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
        <div class="w-24 h-24 mb-4">
          <EmptyBetSlip className="w-24 h-24 fill-BrandPurple" />
        </div>
        <p class="text-lg text-gray-400 md:text-sm">There are no selections in<br>your bet slip.</p>
      </div>
    {:else}
      <div class="flex items-center px-4 py-2 mt-2 rounded bg-BrandPurple">
        <span class="text-white">{selectedBets.length} Singles</span>
      </div>
      <div class="flex-1 p-4 space-y-2">
        {#each selectedBets as bet, index}
          <div class="relative p-4 border rounded-lg bg-BrandBetSlipGray">
            <button 
              class="absolute text-BrandTextGray2 top-2 right-2 hover:text-gray-300" 
              aria-label="Remove selection"
              on:click={() => removeBet(index)}
            >×</button>
            <div class="mb-1">
              <div class="flex items-center">
                <p class="text-sm font-medium text-black">
                  {bet.homeClub.name} vs {bet.awayClub.name} @
                </p>
                <p class="pl-2 text-sm font-medium text-BrandPurple">{bet.odds.toFixed(2)}</p>
              </div>
              <p class="text-xs text-gray-600 mt-0.5">
                {#if bet.type === 'score'}
                  {(() => {
                    if (!bet.score) return 'Score not available';
                    const [homeGoals, awayGoals] = bet.score.split('-').map(Number);
                    const resultType = homeGoals > awayGoals 
                      ? `${bet.homeClub.name} Win`
                      : homeGoals < awayGoals 
                      ? `${bet.awayClub.name} Win`
                      : 'Draw';
                    return `${bet.description?.includes('Half Time') ? 'Half Time' : 'Full Time'} Score: ${bet.score} (${resultType})`;
                  })()}
                {:else if bet.type === 'halftime-fulltime'}
                  {bet.description.replace('Half Time/Full Time:', 'Result:')}
                {:else}
                  {bet.description || 'No description'}
                {/if}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Stake:</span>
                <div class="relative flex items-center">
                  <OpenFPLIcon className="absolute left-2 w-3 h-3" />
                  <input 
                    type="number"
                    min="0"
                    class="w-28 pl-7 pr-2 py-1.5 text-right border rounded text-black"
                    bind:value={stakes[index]}
                  />
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500">
                  Returns: {calculateReturns(stakes[index] || 0, bet.odds).toFixed(2)}
                </div>
              </div>
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
            12,454.32
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
        disabled={totalStakes <= 0 || selectedBets.length === 0}
      >
        Place Bet
      </button>
    </div>
  </div>
</div>