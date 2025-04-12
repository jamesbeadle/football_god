<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getFlagComponent } from "$lib/utils/helpers";
  import { onMount } from "svelte";
  import Modal from "../shared/modal.svelte";
  import CardsTab from "./cards-tab.svelte";
  import FixtureEventSection from "./fixture-event-section.svelte";
  import type { Player, PlayerEventData } from "../../../../../declarations/backend/backend.did";

  export let visible = false;
  export let player: Player;
  export let fixtureId: number;
  export let playerEventData: Writable<PlayerEventData[]>;
  export let closeModal: () => void;

  let appearanceStart = 0;
  let appearanceEnd = 90;
  $: if (selectedCard === 2 && cardMinute > 0) {
    appearanceEnd = cardMinute;
  }
  let keeperSaves = 0;
  let selectedCard = 0;
  let goalMinutes: number[] = [];
  let assistMinutes: number[] = [];
  let ownGoalMinutes: number[] = [];
  let penaltySaveMinutes: number[] = [];
  let penaltyMissedMinutes: number[] = [];
  let cardMinute: number = 0;
  let firstYellowMinute: number = 0;
  let redCardType: "straight" | "twoYellows" | null = null;
  
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
    (selectedCard > 0 && (cardMinute < 0 || cardMinute > 90)) ||
    (selectedCard === 2 && appearanceEnd > cardMinute);


  onMount(() => {
    const cardEvents = $playerEventData.filter(
      event =>
        ("YellowCard" in event.eventType || "RedCard" in event.eventType) &&
        event.playerId === player.id
    );
    
    if (cardEvents.length > 0) {
      const redCard = cardEvents.find(e => "RedCard" in e.eventType);
      const yellowCards = cardEvents.filter(e => "YellowCard" in e.eventType);
      
      if (redCard && yellowCards.length === 1) {
        selectedCard = 4;
        redCardType = "twoYellows";
        firstYellowMinute = yellowCards[0].eventStartMinute;
        cardMinute = redCard.eventStartMinute;
      } else if (redCard) {
        selectedCard = 4;
        redCardType = "straight";
        cardMinute = redCard.eventStartMinute;
      } else if (yellowCards.length === 1) {
        selectedCard = 1;
        cardMinute = yellowCards[0].eventStartMinute;
      }
    } else {
      selectedCard = 0;
      cardMinute = 0;
      redCardType = null;
    }
    
    keeperSaves = $playerEventData
      .filter(event => "KeeperSave" in event.eventType && event.playerId == player.id)
      .length;
  });
  
  $: if ($playerEventData.length > 0) {
        
        let appearanceEvent = $playerEventData.filter(event => "Appearance" in event.eventType && event.playerId == player.id)[0];
        
        if(appearanceEvent){
          appearanceStart = appearanceEvent.eventStartMinute;
          appearanceEnd = appearanceEvent.eventEndMinute;
        }
        
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
      if (selectedCard === 1) {
        newEvents.push({
          playerId: player.id,
          eventType: { YellowCard: null },
          eventStartMinute: cardMinute,
          eventEndMinute: cardMinute,
          fixtureId: fixtureId,
          clubId: player.clubId,
        });
      } else if (selectedCard === 4 && redCardType === "twoYellows") {
        newEvents.push({
          playerId: player.id,
          eventType: { YellowCard: null },
          eventStartMinute: firstYellowMinute,
          eventEndMinute: firstYellowMinute,
          fixtureId: fixtureId,
          clubId: player.clubId,
        });
        newEvents.push({
          playerId: player.id,
          eventType: { RedCard: null },
          eventStartMinute: cardMinute,
          eventEndMinute: cardMinute,
          fixtureId: fixtureId,
          clubId: player.clubId,
        });
      } else if (selectedCard === 4 && redCardType === "straight") {
        newEvents.push({
          playerId: player.id,
          eventType: { RedCard: null },
          eventStartMinute: cardMinute,
          eventEndMinute: cardMinute,
          fixtureId: fixtureId,
          clubId: player.clubId,
        });
      }
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
    exitModal();
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

  function removeGoal(minute: number, index: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "Goal" in event.eventType && event.playerId === player.id)
      )
    );
    goalMinutes = goalMinutes.filter((_, i) => i !== index);
  }

  function removeAssist(minute: number, index: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "GoalAssisted" in event.eventType && event.playerId === player.id)
      )
    );
    assistMinutes = assistMinutes.filter((_, i) => i !== index);
  }

  function removePenaltySave(minute: number, index: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "PenaltySaved" in event.eventType && event.playerId === player.id)
      )
    );
    penaltySaveMinutes = penaltySaveMinutes.filter((_, i) => i !== index);
  }

  function removePenaltyMiss(minute: number, index: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "PenaltyMissed" in event.eventType && event.playerId === player.id)
      )
    );
    penaltyMissedMinutes = penaltyMissedMinutes.filter((_, i) => i !== index);
  }

  function removeOwnGoal(minute: number, index: number) {
    playerEventData.set(
      $playerEventData.filter(
        (event) =>
          !(event.eventStartMinute === minute && "OwnGoal" in event.eventType && event.playerId === player.id)
      )
    );
    ownGoalMinutes = ownGoalMinutes.filter((_, i) => i !== index);
  }

  function exitModal(){
    closeModal();
  }

</script>

<Modal {visible} onClose={exitModal}>
  <div class="p-4 mx-4">
    <div class="flex items-center justify-between my-2">
      <h3 class="brand-header">Add Events</h3>
      <button class="times-button" on:click={exitModal}>&times;</button>
    </div>

    <div class="mt-6">
      <div class="flex-col w-full mb-2 space-y-4">
        <div class="flex flex-row items-center space-x-4">
          <svelte:component
            this={getFlagComponent(player.nationality)}
            className="w-4 h-4 mr-2 hidden xs:flex"
          />
          <p class="text-lg">
            {player.firstName !== "" ? player.firstName.charAt(0) + "." : ""}
            {player.lastName}
          </p>
        </div>

        <div class="border-b border-gray-200"></div>

        <div class="flex flex-row space-x-1">
          <div class="flex-col w-1/2 space-y-2 ">
            <p class="block mb-1 text-sm text-gray-400">Start Minute</p>
            <input
              type="number"
              id="startMinute"
              bind:value={appearanceStart}
              class="modal-input-box"
              placeholder="Enter start minute"
              min="0"
              max="90"
            />
          </div>

          <div class="flex-col w-1/2 space-y-2">
            <p class="block mb-1 text-sm text-gray-400">End Minute</p>
            <input
              type="number"
              id="endMinute"
              bind:value={appearanceEnd}
              class="modal-input-box"
              max={selectedCard === 2 ? cardMinute : 90}
              placeholder="Enter end minute"
              min="0"
            />
          </div>
        </div>

        <div class="border-b border-gray-200"></div>

        {#if Object.keys(player.position)[0] == "Goalkeeper"}

          <div class="flex flex-row space-x-1">
            <div class="flex-col w-full space-y-2">
              <p class="block mb-1 text-sm text-gray-400">Keeper Saves</p>
              <input
                type="number"
                id="keeperSaves"
                bind:value={keeperSaves}
                class="modal-input-box"
                placeholder="Enter keeper saves"
                min="0"
                max="999"
              />
            </div>
          </div>
          <div class="border-b border-gray-200"></div>
        {/if}

        <CardsTab
          bind:selectedCard
          bind:cardMinute
          bind:firstYellowMinute
          bind:redCardType
        />

        <div class="border-b border-gray-200"></div>

        <FixtureEventSection
          title="Goals"
          bind:eventMinutes={goalMinutes}
          bind:sliderValue={goalSliderValue}
          onAdd={addGoalEvent}
          onRemove={removeGoal}
        />

        <div class="border-b border-gray-200"></div>

        <FixtureEventSection
          title="Assists"
          eventMinutes={assistMinutes}
          bind:sliderValue={assistSliderValue}
          onAdd={addAssistEvent}
          onRemove={removeAssist}
        />
        
        <div class="border-b border-gray-200"></div>

        <FixtureEventSection
          title="Own Goals"
          eventMinutes={ownGoalMinutes}
          bind:sliderValue={ownGoalSliderValue}
          onAdd={addOwnGoalEvent}
          onRemove={removeOwnGoal}
        />
      
        <div class="border-b border-gray-200"></div>
        
        {#if Object.keys(player.position)[0] == "Goalkeeper"}

          <FixtureEventSection
            title="Penalty Saved"
            eventMinutes={penaltySaveMinutes}
            bind:sliderValue={penaltySaveSliderValue}
            onAdd={addPenaltySaveEvent}
            onRemove={removePenaltySave}
          />
          <div class="border-b border-gray-200"></div>
        {/if}
        
        <FixtureEventSection
          title="Penalty Missed"
          eventMinutes={penaltyMissedMinutes}
          bind:sliderValue={penaltyMissSliderValue}
          onAdd={addPenaltyMissEvent}
          onRemove={removePenaltyMiss}
        />
        
        <div class="border-b border-gray-200"></div>

        <div class="flex items-center justify-end space-x-4">
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
