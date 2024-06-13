<script lang="ts">
  import { Modal, Spinner } from "@dfinity/gix-components";
  import type { Euro2024EventDTO, Euro2024Fixture, EventType, InternationalPlayer, InternationalTeam, TournamentStage } from "../../../../../declarations/football_god_backend/football_god_backend.did";
  import { onMount } from "svelte";
  import { euro2024Store } from "$lib/stores/euro2024.store";
  import { teamStore } from "$lib/stores/teams.store";
  import { playerStore } from "$lib/stores/player.store";

  export let visible = false;
  export let onConfirm: (eventDTO: Euro2024EventDTO) => void;
  export let onClose: () => void;

  let isLoading = true;
  let selectedStage: TournamentStage = { 'GroupA': null };
  let selectedEventType: EventType = { 'StageWon': null };
  let fixtureId = 0;
  let teamId = 0;
  let playerId = 0;

  let fixtures: Euro2024Fixture[] = [];
  let players: InternationalPlayer[] = [];
  let filteredTeams: InternationalTeam[] = [];
  let stages: TournamentStage[] = [
      { 'GroupA': null },
      { 'GroupB': null },
      { 'GroupC': null },
      { 'GroupD': null },
      { 'GroupE': null },
      { 'GroupF': null },
      { 'RoundOf16': null },
      { 'QuarterFinal': null },
      { 'SemiFinal': null },
      { 'Final': null },
  ];
  let eventTypes: EventType[] = [
      { 'RedCard': null },
      { 'GoalScored': null },
      { 'StageLost': null },
      { 'StageWon': null },
      { 'YellowCard': null },
      { 'GoalAssisted': null }
  ];

  onMount(async () => {
      try {
          await euro2024Store.sync();
          await teamStore.sync();
          await playerStore.sync();
          fixtures = await euro2024Store.getFixtures();
          filteredTeams = $teamStore;
          players = $playerStore;
      } catch {
          console.log("error fetching data");
      } finally {
          isLoading = false;
      }
  });

  $: filteredPlayers = players.filter(player => player.teamId === teamId);


  function isPlayerRequired(eventType: EventType) {
      const playerNotRequiredTypes = [{ 'StageWon': null }, { 'StageLost': null }];
      return !playerNotRequiredTypes.some(type => JSON.stringify(type) === JSON.stringify(eventType));
  }

  function validateForm() {
    return true;
  }

  function handleSubmit() {
      if (validateForm()) {
        let dto: Euro2024EventDTO = {
            eventId : 0n,
            fixtureId : fixtureId,
            stage : selectedStage,
            playerId : playerId,
            teamId : teamId,
            eventType : selectedEventType,
        };
        onConfirm(dto);
      }
  }
</script>

<Modal {visible} on:nnsClose={onClose}>
    {#if isLoading}
        <Spinner />
    {:else}
        <div class="mx-4 p-4">
            <div class="flex justify-between items-center mt-2">
                <h4 class="text-OPENFPL">Add Euro 2024 Event</h4>
                <button class="text-white" on:click={onClose}>✕</button>
            </div>
  
            <form on:submit|preventDefault={handleSubmit}>
                <div class="mt-4">
                    <label for="selected-stage" class="block mb-2">Stage</label>
                    <select name="selected-stage" bind:value={selectedStage} class="block w-full p-2 border bg-gray-500 rounded">
                        {#each stages as stage}
                            <option value={stage}>{Object.keys(stage)}</option>
                        {/each}
                    </select>
                </div>
                <div class="mt-4">
                    <label for="event-type" class="block mb-2">Event Type</label>
                    <select name="event-type" bind:value={selectedEventType} class="block w-full p-2 border bg-gray-500 rounded">
                        {#each eventTypes as type}
                            <option value={type}>{Object.keys(type)}</option>
                        {/each}
                    </select>
                </div>
                {#if selectedEventType && !isPlayerRequired(selectedEventType)}
                <div class="mt-4">
                    <label for="selected-team" class="block mb-2">Team</label>
                    <select name="selected-team" bind:value={teamId} class="block w-full p-2 border bg-gray-500 rounded">
                        {#each filteredTeams as team}
                            <option value={team.id}>{team.name}</option>
                        {/each}
                    </select>
                </div>
                {/if}
                {#if selectedEventType && isPlayerRequired(selectedEventType)}
                <div class="mt-4">
                    <label for="selected-team" class="block mb-2">Team</label>
                    <select name="selected-team" bind:value={teamId} class="block w-full p-2 border bg-gray-500 rounded">
                        {#each filteredTeams as team}
                            <option value={team.id}>{team.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="mt-4">
                    <label for="selected-player" class="block mb-2">Player</label>
                    <select name="selected-player" bind:value={playerId} class="block w-full p-2 border bg-gray-500 rounded">
                        {#each filteredPlayers as player}
                            <option value={player.id}>{player.firstName} {player.lastName}</option>
                        {/each}
                    </select>
                </div>
                {/if}
                <div class="flex justify-end gap-3 mt-4 mb-2">
                    <button
                        class="default-button bg-red-100 px-4 py-2 text-black"
                        type="button"
                        on:click={onClose}>Cancel</button>
  
                    <button class="default-button bg-OPENFPL px-4 py-2" type="submit">Confirm</button>
                </div>
            </form>
        </div>
    {/if}
  </Modal>
  