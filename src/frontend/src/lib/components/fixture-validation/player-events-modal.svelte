<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getFlagComponent } from "$lib/utils/helpers";
  import type { PlayerDTO, PlayerEventData } from "../../../../../declarations/backend/backend.did";
    import { onMount } from "svelte";
    import Modal from "../shared/modal.svelte";

  export let visible = false;
  export let player: PlayerDTO;
  export let fixtureId: number;
  export let playerEventData: Writable<PlayerEventData[]>;
  export let closeModal: () => void;

  let appearanceStart = 0;
  let appearanceEnd = 90;
  let keeperSaves = 0;
  let selectedCard = 0;
  let goalMinutes: number[] = [];
  let assistMinutes: number[] = [];
  let ownGoalMinutes: number[] = [];
  let penaltySaveMinutes: number[] = [];
  let penaltyMissedMinutes: number[] = [];
  let cardMinute: number = 0;
  
  let goalSliderValue = 0;
  let assistSliderValue = 0;
  let ownGoalSliderValue = 0;
  let penaltySaveSliderValue = 0;
  let penaltyMissSliderValue = 0;

  let isSubmitDisabled: boolean = true;
  $: isSubmitDisabled =
  appearanceStart < 0 ||
  appearanceStart > 90 ||
  appearanceEnd < 0 ||
  appearanceEnd > 90 ||
  (selectedCard > 0 && (cardMinute < 0 || cardMinute > 90));


  onMount(() => {
    const cardEvent = $playerEventData.find(
      event =>
        ("YellowCard" in event.eventType || "RedCard" in event.eventType) &&
        event.playerId === player.id
    );
    selectedCard = cardEvent ? ("YellowCard" in cardEvent.eventType ? 1 : 2) : 0;
    cardMinute = cardEvent ? cardEvent.eventStartMinute : 0;

    keeperSaves = $playerEventData
      .filter(event => "KeeperSave" in event.eventType && event.playerId == player.id)
      .length;
  });
  
  $: if ($playerEventData.length > 0) {
        goalMinutes = $playerEventData
          .filter(event => "Goal" in event.eventType && event.playerId == player.id)
          .map(event => event.eventStartMinute);

        assistMinutes = $playerEventData
          .filter(event => "GoalAssisted" in event.eventType && event.playerId == player.id)
          .map(event => event.eventStartMinute);

        ownGoalMinutes = $playerEventData
          .filter(event => "OwnGoal" in event.eventType && event.playerId == player.id)
          .map(event => event.eventStartMinute);

        penaltySaveMinutes = $playerEventData
          .filter(event => "PenaltySaved" in event.eventType && event.playerId == player.id)
          .map(event => event.eventStartMinute);

        penaltyMissedMinutes = $playerEventData
          .filter(event => "PenaltyMissed" in event.eventType && event.playerId == player.id)
          .map(event => event.eventStartMinute);

       }


  function addPlayerEvents() {
    let newEvents: PlayerEventData[] = [];

    newEvents.push({
      playerId: player.id,
      eventType: { Appearance: null },
      eventStartMinute: Number(appearanceStart),
      eventEndMinute: Number(appearanceEnd),
      fixtureId: fixtureId,
      clubId: player.clubId,
    });

    goalMinutes.forEach((minute) => {
      newEvents.push({
        playerId: player.id,
        eventType: { Goal: null },
        eventStartMinute: minute,
        eventEndMinute: minute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    });

    assistMinutes.forEach((minute) => {
      newEvents.push({
        playerId: player.id,
        eventType: { GoalAssisted: null },
        eventStartMinute: minute,
        eventEndMinute: minute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    });

    ownGoalMinutes.forEach((minute) => {
      newEvents.push({
        playerId: player.id,
        eventType: { OwnGoal: null },
        eventStartMinute: minute,
        eventEndMinute: minute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    });

    penaltySaveMinutes.forEach((minute) => {
      newEvents.push({
        playerId: player.id,
        eventType: { PenaltySaved: null },
        eventStartMinute: minute,
        eventEndMinute: minute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    });

    penaltyMissedMinutes.forEach((minute) => {
      newEvents.push({
        playerId: player.id,
        eventType: { PenaltyMissed: null },
        eventStartMinute: minute,
        eventEndMinute: minute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    });

    if (selectedCard > 0 && cardMinute !== null) {
      let cardType = selectedCard === 1 ? { YellowCard: null } : { RedCard: null };
      newEvents.push({
        playerId: player.id,
        eventType: cardType,
        eventStartMinute: cardMinute,
        eventEndMinute: cardMinute,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    }


    for (let i = 0; i < keeperSaves; i++) {
      newEvents.push({
        playerId: player.id,
        eventType: { KeeperSave: null },
        eventStartMinute: 0,
        eventEndMinute: 0,
        fixtureId: fixtureId,
        clubId: player.clubId,
      });
    }

    playerEventData.set($playerEventData.filter(x => x.playerId != player.id));
    playerEventData.set([...$playerEventData, ...newEvents]);
    closeModal();
  }

  function addGoalEvent() {
    goalMinutes = [...goalMinutes, goalSliderValue];
  }

  function addAssistEvent() {
    assistMinutes = [...assistMinutes, assistSliderValue];
  }

  function addOwnGoalEvent() {
    ownGoalMinutes = [...ownGoalMinutes, ownGoalSliderValue];
  }

  function addPenaltySaveEvent() {
    penaltySaveMinutes = [...penaltySaveMinutes, penaltySaveSliderValue];
  }

  function addPenaltyMissEvent() {
    penaltyMissedMinutes = [...penaltyMissedMinutes, penaltyMissSliderValue];
  }

  function removeGoal(minute: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "Goal" in event.eventType && event.playerId === player.id)
      )
    );
    goalMinutes = goalMinutes.filter((m) => m !== minute);
  }

  function removeAssist(minute: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "GoalAssisted" in event.eventType && event.playerId === player.id)
      )
    );
    assistMinutes = assistMinutes.filter((m) => m !== minute);
  }

  function removePenaltySave(minute: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "PenaltySaved" in event.eventType && event.playerId === player.id)
      )
    );
    penaltySaveMinutes = penaltySaveMinutes.filter((m) => m !== minute);
  }

  function removePenaltyMiss(minute: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "PenaltyMissed" in event.eventType && event.playerId === player.id)
      )
    );
    penaltyMissedMinutes = penaltyMissedMinutes.filter((m) => m !== minute);
  }

  function removeOwnGoal(minute: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "OwnGoal" in event.eventType && event.playerId === player.id)
      )
    );
    ownGoalMinutes = ownGoalMinutes.filter((m) => m !== minute);
  }

</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Add Events</h3>
      <button class="times-button" on:click={closeModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <div class="flex flex-row items-center">
          <svelte:component
            this={getFlagComponent(player.nationality)}
            class="w-4 h-4 mr-2 hidden xs:flex"
          />
          <p>
            {player.firstName !== "" ? player.firstName.charAt(0) + "." : ""}
            {player.lastName}
          </p>
        </div>

        <div class="border-b border-gray-200" />

        <div class="flex flex-row space-x-1">
          <div class="flex-col space-y-2 w-1/2">
            <p>Start Minute</p>
            <input
              type="number"
              id="startMinute"
              bind:value={appearanceStart}
              class="bg-gray-900 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter start minute"
              min="0"
              max="90"
            />
          </div>

          <div class="flex-col space-y-2 w-1/2">
            <p>End Minute</p>
            <input
              type="number"
              id="endMinute"
              bind:value={appearanceEnd}
              class="bg-gray-900 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter end minute"
              min="0"
              max="90"
            />
          </div>
        </div>

        {#if Object.keys(player.position)[0] == "Goalkeeper"}

          <div class="flex flex-row space-x-1">
            <div class="flex-col space-y-2 w-full">
              <p>Keeper Saves</p>
              <input
                type="number"
                id="keeperSaves"
                bind:value={keeperSaves}
                class="bg-gray-900 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter keeper saves"
                min="0"
                max="999"
              />
            </div>
          </div>
        {/if}

        <div class="flex-col space-y-2">
          <p>Select Cards:</p>
          <div class="flex flex-row">
            <input
              type="radio"
              class="form-radio h-5 w-5 text-blue-600"
              name="options"
              value={0}
              bind:group={selectedCard}
            />
            <p class="ml-2">No Card</p>
            
            <input
              type="radio"
              class="form-radio h-5 w-5 text-blue-600 ml-2"
              name="options"
              value={1}
              bind:group={selectedCard}
            />
            <p class="ml-2">Yellow Card</p>
            
            <input
              type="radio"
              class="form-radio h-5 w-5 text-blue-600 ml-2"
              name="options"
              value={2}
              bind:group={selectedCard}
            />
            <p class="ml-2">Red Card</p>
          </div>
          
          {#if selectedCard > 0}
            <div class="flex-col space-y-2 w-1/2">
              <p>Minute of Card</p>
              <input
                type="number"
                bind:value={cardMinute}
                class="bg-gray-900 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minute"
                min="0"
                max="90"
                required
              />
            </div>
          {/if}
          
        </div>

        <div class="flex-col space-y-2">
          <p>Add Goals:</p>
          <p class="text-sm">Minute</p>
          <div class="flex flex-row items-center">
            <input
              type="range"
              class="w-10/12"
              min="0"
              max="90"
              bind:value={goalSliderValue}
            />
            <span class="ml-2 text-gray-300">{goalSliderValue} min</span>
            <button class="brand-button w-1/12 ml-4 py-1" on:click={addGoalEvent}>+</button>
          </div>
          <div class="flex flex-wrap">
            {#each goalMinutes as minute}
              <div class="event-tag mt-2">
                {minute} Min
                <button class="p-1" on:click={() => removeGoal(minute)}>x</button>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="flex-col space-y-2">
          <p>Add Assists:</p>
          <p class="text-sm">Minute</p>
          <div class="flex flex-row items-center">
            <input
              type="range"
              class="w-10/12"
              min="0"
              max="90"
              bind:value={assistSliderValue}
            />
            <span class="ml-2 text-gray-300">{assistSliderValue} min</span>
            <button class="brand-button w-1/12 ml-4 py-1" on:click={addAssistEvent}>+</button>
          </div>
          <div class="flex flex-wrap">
            {#each assistMinutes as minute}
              <div class="event-tag mt-2">
                {minute} Min
                <button class="p-1" on:click={() => removeAssist(minute)}>x</button>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="flex-col space-y-2">
          <p>Add Own Goals:</p>
          <p class="text-sm">Minute</p>
          <div class="flex flex-row items-center">
            <input
              type="range"
              class="w-10/12"
              min="0"
              max="90"
              bind:value={ownGoalSliderValue}
            />
            <span class="ml-2 text-gray-300">{ownGoalSliderValue} min</span>
            <button class="brand-button w-1/12 ml-4 py-1" on:click={addOwnGoalEvent}>+</button>
          </div>
          <div class="flex flex-wrap">
            {#each ownGoalMinutes as minute}
              <div class="event-tag mt-2">
                {minute} Min
                <button class="p-1" on:click={() => removeOwnGoal(minute)}>x</button>
              </div>
            {/each}
          </div>
        </div>
        
        {#if Object.keys(player.position)[0] == "Goalkeeper"}
          <div class="flex-col space-y-2">
            <p>Penalty Saved:</p>
            <p class="text-sm">Minute</p>
            <div class="flex flex-row items-center">
              <input
                type="range"
                class="w-10/12"
                min="0"
                max="90"
                bind:value={penaltySaveSliderValue}
              />
              <span class="ml-2 text-gray-300">{penaltySaveSliderValue} min</span>
              <button class="brand-button w-1/12 ml-4 py-1" on:click={addPenaltySaveEvent}>+</button>
            </div>
            <div class="flex flex-wrap">
              {#each penaltySaveMinutes as minute}
                <div class="event-tag mt-2">
                  {minute} Min
                  <button class="p-1" on:click={() => removePenaltySave(minute)}>x</button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="flex-col space-y-2">
          <p>Penalty Missed:</p>
          <p class="text-sm">Minute</p>
          <div class="flex flex-row items-center">
            <input
              type="range"
              class="w-10/12"
              min="0"
              max="90"
              bind:value={penaltyMissSliderValue}
            />
            <span class="ml-2 text-gray-300">{penaltyMissSliderValue} min</span>
            <button class="brand-button w-1/12 ml-4 py-1" on:click={addPenaltyMissEvent}>+</button>
          </div>
          <div class="flex flex-wrap">
            {#each penaltyMissedMinutes as minute}
              <div class="event-tag mt-2">
                {minute} Min
                <button class="p-1" on:click={() => removePenaltyMiss(minute)}>x</button>
              </div>
            {/each}
          </div>
        </div>
        

        <div class="items-center flex space-x-4 justify-end">
          <button
            on:click={addPlayerEvents}
            class="brand-button px-4 py-2 min-w-[150px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</Modal>
