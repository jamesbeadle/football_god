<script lang="ts">
  import OpenFPLIcon from "../../icons/OpenFPLIcon.svelte";
  import EmptyBetSlipIcon from "$lib/icons/EmptyBetSlipIcon.svelte";
  import type { FootballLeagueDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import type { FixtureDTO, ClubDTO } from "../../../../../declarations/data_canister/data_canister.did";

  import { betSlipStore } from "$lib/stores/bet-slip-store";
  import { availableMultiplesStore, calculateMultipleOdds, calculateMultipleOddsForType } from "$lib/derived/bets.derived";
  import BetPlaceholder from "./bet-placeholder.svelte";

  interface ExtendedFixtureDTO extends FixtureDTO {
    leagueId: number;
  }

  export let isExpanded: boolean = false;
  export let leagueData: Record<number, FootballLeagueDTO>;
  export let fixtureData: Record<number, ExtendedFixtureDTO>;
  export let clubsData: Record<number, Record<number, ClubDTO>>;
  
  let showPlaceBet = false;

  $: rawSlipState = $betSlipStore;
  $: slipState = rawSlipState ?? {
    bets: [],
    isMultiple: false,
    singleStakes: {},
    multipleStakes: {}
  };

  $: bets = Array.isArray(slipState.bets) ? slipState.bets : [];
  $: isMultiple = slipState.isMultiple;
  $: singleStakes = slipState.singleStakes;
  $: multipleStakes = slipState.multipleStakes;

  $: possibleMultiples = $availableMultiplesStore ?? [];

  $: combinedOdds = calculateMultipleOdds(bets);

  $: singleStakesTotal = Object.values(singleStakes).reduce((acc, v) => acc + (v || 0), 0);
  $: multipleStakesTotal = Object.values(multipleStakes).reduce((acc, v) => acc + (v || 0), 0);
  $: totalStakes = isMultiple
    ? singleStakesTotal + multipleStakesTotal
    : singleStakesTotal;

  $: totalReturns = 0;
  $: {
    let sum = 0;
    
    if (!isMultiple) {
      if (Array.isArray(bets)) {
        bets.forEach((bet, idx) => {
          const st = singleStakes[idx] || 0;
          sum += st * (1 + bet.odds);
        });
      }
    } else {
      if (Array.isArray(bets)) {
        bets.forEach((bet, idx) => {
          const st = singleStakes[idx] || 0;
          sum += st * (1 + bet.odds);
        });
      }
      for (const [mKey, stVal] of Object.entries(multipleStakes)) {
        sum += (stVal || 0) * (1 + combinedOdds);
      }
    }

    totalReturns = sum;
  }

  const {
    removeBet,
    setIsMultiple,
    setSingleStake,
    setMultipleStake
  } = betSlipStore;

  function removeSingleBet(index: number) {
    if (!Array.isArray(bets)) return;
    const bet = bets[index];
    removeBet(
      bet.leagueId,
      bet.fixtureId,
      bet.selectionType,
      bet.selectionDetail
    );
  }

  function onSingleStakeInput(index: number, val: string) {
    const stakeNum = parseFloat(val) || 0;
    setSingleStake(index, stakeNum);
  }

  function onMultipleStakeInput(mKey: string, val: string) {
    const stakeNum = parseFloat(val) || 0;
    setMultipleStake(mKey, stakeNum);
  }

  function placebet(){
    showPlaceBet = true;
  }

  function closePlaceBet(){
    showPlaceBet = false;
  }

  function getLeagueAndFixtureDetails(bet: any) {
    const league = leagueData[bet.leagueId];
    const fixture = fixtureData[bet.fixtureId];

    return {
      leagueName: league?.name || `League ${bet.leagueId}`,
      fixtureDetails: fixture ? 
        `${getClub(fixture.leagueId, fixture.homeClubId)?.name ?? 'Unknown'} vs ${getClub(fixture.leagueId, fixture.awayClubId)?.name ?? 'Unknown'}` : 
        `Fixture ${bet.fixtureId}`
    };
  }

  function getClub(leagueId: number, clubId: number): ClubDTO | undefined {
    return clubsData[leagueId]?.[clubId];
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
</div>
{#if showPlaceBet}
  <BetPlaceholder visible={showPlaceBet} closeModal={closePlaceBet} />
{/if}