<script lang="ts">
  import type { PlayerEventData } from "../../../../../declarations/data_canister/data_canister.did";
  import type { Writable } from "svelte/store";

  export let selectedCard: number;
  export let cardMinute: number;
  export let firstYellowMinute: number;
  export let fixtureId: number;
  export let playerId: number;
  export let clubId: number;
  export let playerEventData: Writable<PlayerEventData[]>;
  export let redCardType: "straight" | "twoYellows" | null = null;

  function handleCardSelection(value: number) {
    selectedCard = value;
    if (value === 0) {
      redCardType = "straight";  
    } else if (value === 4) {
      redCardType = null;
    }
  }

  function handleRedCardTypeChange(type: "straight" | "twoYellows") {
    redCardType = type;
  }
</script>

<div class="flex flex-col space-y-4">
  <p class="text-lg font-medium">Select Cards:</p>
  <div class="flex flex-col space-y-2">
    <label class="flex items-center space-x-2">
      <input type="radio" bind:group={selectedCard} class="w-5 h-5 border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0 form-radio" value={0} on:change={() => handleCardSelection(0)} />
      <span>No Card</span>
    </label>
    <label class="flex items-center space-x-2">
      <input type="radio" bind:group={selectedCard} class="w-5 h-5 border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0 form-radio" value={1} on:change={() => handleCardSelection(1)} />
      <span>Yellow Card</span>
    </label>
    <label class="flex items-center space-x-2">
      <input type="radio" bind:group={selectedCard} class="w-5 h-5 border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0 form-radio" value={4} on:change={() => handleCardSelection(4)} />
      <span>Red Card</span>
    </label>
  </div>

  {#if selectedCard === 1}
    <div class="flex-col w-1/2 space-y-2">
        <p class="block mb-1 text-sm text-gray-400">Minute of Card</p>
        <input
            type="number"
            bind:value={cardMinute}
            class="modal-input-box"
            placeholder="Enter minute"
            min="0"
            max="90"
            required
        />
    </div>
  {/if}

  {#if selectedCard === 4}
    <div class="flex flex-col mt-4 space-y-2">
      <p class="text-sm text-gray-400">Type of Red Card:</p>
      <div class="flex flex-col ml-4 space-y-2">
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            class="w-5 h-5 border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0 form-radio"
            bind:group={redCardType} 
            value="straight" 
            on:change={() => handleRedCardTypeChange("straight")}
          />
          <span>Straight Red</span>
        </label>
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            class="w-5 h-5 border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0 form-radio"
            bind:group={redCardType} 
            value="twoYellows"
            on:change={() => handleRedCardTypeChange("twoYellows")}
          />
          <span>Two Yellow Cards</span>
        </label>
      </div>
    </div>
  {/if}

  {#if selectedCard === 4 && redCardType === "straight"}
    <div class="flex-col mt-4 space-y-2">
      <p class="block mb-1 text-sm text-gray-400">Minute of Red Card</p>
      <input
        type="number"
        bind:value={cardMinute}
        class="modal-input-box"
        placeholder="Enter minute"
        min="0"
        max="90"
        required
      />
    </div>
  {:else if selectedCard === 4 && redCardType === "twoYellows"}
    <div class="grid grid-cols-1 gap-4 mt-4">
      <div class="flex-col">
        <p class="block mb-1 text-sm text-gray-400">Minute of First Yellow</p>
        <input
          type="number"
          bind:value={firstYellowMinute}
          class="modal-input-box"
          placeholder="Enter minute"
          min="0"
          max="90"
          required
        />
      </div>
      <div class="flex-col">
        <p class="block mb-1 text-sm text-gray-400">Minute of Second Yellow</p>
        <input
          type="number"
          bind:value={cardMinute}
          class="modal-input-box"
          placeholder="Enter minute"
          min="0"
          max="90"
          required
        />
      </div>
    </div>
  {/if}
</div>
