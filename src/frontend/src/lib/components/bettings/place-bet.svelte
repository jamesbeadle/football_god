<script lang="ts">
    import { bettingStore } from "$lib/stores/betting-store";
    import Modal from "../shared/modal.svelte";
  
    export let visible: boolean;
    export let closeModal: () => void;
    export let cancelModal: () => void;
  
    async function placeBet() {
      try {
        await bettingStore.placeBet(bet);
        await closeModal();
      } catch (error) {
        console.error("Error placing bet:", error);
        cancelModal();
      } finally {
      }
    }
  </script>
  
  <Modal showModal={visible} onClose={closeModal}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Place Bet</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
      <form on:submit|preventDefault={placeBet}>
        
        
        



        <div class="flex items-center justify-between p-4 border-b border-gray-100 md:px-4 md:py-2 md:bg-gray-100">
            <div class="flex items-center">
              <span class="flex items-center justify-center w-8 text-lg font-medium text-white rounded-full h-7 bg-BrandPurple">
                {bets.length}
              </span>
              <span class="px-3 text-xl font-bold text-black">Bet Slip</span>
            </div>
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
              <div class="px-4 py-2 mt-2 rounded bg-BrandPurple">
                <span class="text-white">
                  {bets.length > 1 ? bets.length + " Singles" : "Single Bet"}
                </span>
              </div>
        
              <div class="flex-1 p-4 space-y-2">
                {#each bets as bet, index}
                  {@const details = getLeagueAndFixtureDetails(bet)}
                  <div class="flex flex-col gap-2 p-2 border border-gray-300 rounded">
                    <div class="flex justify-between">
                      <div>
                        <p class="text-sm font-medium text-black">{bet.uiDescription}</p>
                        <p class="text-xs text-gray-500">
                          {details.leagueName} - {details.fixtureDetails}
                        </p>
                      </div>
                      <button
                        class="text-gray-400 hover:text-red-500"
                        on:click={() => removeSingleBet(index)}
                      >
                        &times;
                      </button>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">@ {bet.odds.toFixed(2)}</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Stake"
                        class="stake-input"
                        bind:value={slipState.singleStakes[index]}
                        on:input={(e) => 
                          onSingleStakeInput(
                            index, 
                            (e.currentTarget as HTMLInputElement).value
                          )
                        }
                      
                      />
                    </div>
        
                    {#if singleStakes[index] && singleStakes[index] > 0}
                      <div class="text-sm text-gray-700">
                        Potential Returns: 
                        <span class="font-medium">
                          {(singleStakes[index] * (1 + bet.odds)).toFixed(2)}
                        </span>
                      </div>
                    {/if}
                    
                  </div>
                {/each}
              </div>
        
              {#if possibleMultiples.length > 0}
                <div class="px-4 py-2 mt-2 rounded bg-BrandPurple">
                  <span class="text-white">Multiple Bet</span>
                </div>
        
                <div class="flex items-center p-4 space-x-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      bind:checked={slipState.isMultiple}
                      on:change={() => setIsMultiple(slipState.isMultiple)}
                    />
                    <span class="text-sm text-gray-700">Enable Multiple Betting</span>
                  </label>
                </div>
        
                {#if slipState.isMultiple}
                  <div class="flex flex-col px-4 pb-4 space-y-2">
                    {#each possibleMultiples as multi}
                    {#each Object.keys(multi) as mKey}
                      {#if slipState.isMultiple}
                      
                        {@const multiOdds = calculateMultipleOddsForType(bets, multi)}
                        <div class="flex flex-col gap-1 p-2 border border-gray-300 rounded">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-black">
                              {mKey}
                            </p>
                            <input
                              type="number"
                              min="0"
                              placeholder="Stake"
                              class="stake-input"
                              bind:value={slipState.multipleStakes[mKey]}
                              on:input={(e) => onMultipleStakeInput(mKey, (e.currentTarget as HTMLInputElement).value)}
                            />
                          </div>
                          <p class="text-xs text-gray-500">
                            Combined odds: 
                              {multiOdds.toFixed(2)}
                          </p>
                    
                          {#if slipState.multipleStakes[mKey] && slipState.multipleStakes[mKey] > 0}
                            <p class="text-sm text-gray-700">
                              Potential Returns:
                              <span class="font-medium">
                                { (slipState.multipleStakes[mKey] + (slipState.multipleStakes[mKey] * multiOdds)).toFixed(2)}
                              </span>
                            </p>
                          {/if}
                        </div>
                      {/if}
                    {/each}
                    {/each}
                  </div>
                {/if}
              {/if}
            {/if}
        
            <div class="p-6 mt-auto border-t border-gray-100 md:p-4 md:bg-gray-100">
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
                  <OpenFPLIcon className="w-3 h-3 mr-1" />
                  {totalReturns.toFixed(2)}
                </span>
              </div>
        
              <button
                class="brand-button"
                disabled={bets.length === 0 || totalStakes <= 0}
                on:click={placebet}
              >
                Place Bet
              </button>
            </div>
          </div>























        
        <div class="items-center py-3 flex space-x-4 flex-row">
          <button
            class="px-4 py-2 brand-cancel-button"
            type="button"
            on:click={cancelModal}
          >
            Cancel
          </button>
          <button
            class={`px-4 py-2 brand-button`}
            type="submit"
          >
            Place Bet
          </button>
        </div>
      </form>
    </div>
  </Modal>