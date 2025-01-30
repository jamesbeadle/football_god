<script lang="ts">
  import { convertPlayerPosition } from "$lib/utils/helpers";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import { type Writable } from "svelte/store";
    import Modal from "../shared/modal.svelte";
    import type { ClubDTO, PlayerDTO, PlayerEventData } from "../../../../../declarations/data_canister/data_canister.did";
  
  export let selectedTeam: ClubDTO;
  export let teamPlayers: PlayerDTO[];
  export let selectedPlayers: Writable<PlayerDTO[]>;
  export let playerEventData: Writable<PlayerEventData[]>;
  export let visible = false;

  function handlePlayerSelection(event: Event, player: PlayerDTO) {
    const input = event.target as HTMLInputElement;

    let allSelectedPlayers = $selectedPlayers;
    let allTeamPlayers = teamPlayers;
    if (input.checked) {
      const playerToAdd = allTeamPlayers.find((x) => x.id === player.id);
      if (playerToAdd && !allSelectedPlayers.some((x) => x.id === player.id)) {
        allSelectedPlayers = [...allSelectedPlayers, playerToAdd];
      }
    } else {
      allSelectedPlayers = allSelectedPlayers.filter((x) => x.id !== player.id);
      playerEventData.set($playerEventData.filter(x => x.playerId != player.id));
    }
    $selectedPlayers = allSelectedPlayers;
    
  }

  export let closeModal: () => void;
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Select Players</h3>
      <button class="times-button" on:click={closeModal}>&times;</button>
    </div>
    <div class="flex-row flex items-center mb-4">
      <BadgeIcon
        className="h-6 mr-2"
        primaryColour={selectedTeam?.primaryColourHex}
        secondaryColour={selectedTeam?.secondaryColourHex}
        thirdColour={selectedTeam?.thirdColourHex}
      />
      <p class="text-center">{selectedTeam?.friendlyName}</p>
    </div>
    <div class="my-2 grid grid-cols-1 sm:grid-cols-2 gap-x-2">
      {#each teamPlayers.sort((a, b) => convertPlayerPosition(a.position) - convertPlayerPosition(b.position)) as player}
        {@const selected = $selectedPlayers.some((p) => p.id === player.id)}
        <div
          class="flex flex-row justify-between items-center p-2 border border-gray-600 text-xs"
        >
          <div class="form-checkbox w-1/12">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5"
                checked={selected}
                on:change={(e) => {
                  handlePlayerSelection(e, player);
                }}
              />
            </label>
          </div>
          <div class="flex w-2/12 justify-center">
            <span>
              {#if Object.keys(player.position)[0] == "Goalkeeper"}GK{/if}
              {#if Object.keys(player.position)[0] == "Defender"}DF{/if}
              {#if Object.keys(player.position)[0] == "Midfielder"}MF{/if}
              {#if Object.keys(player.position)[0] == "Forward"}FW{/if}
            </span>
          </div>
          <div class="flex flex-grow">
            <span>
              {`${
                player.firstName.length > 0
                  ? player.firstName.charAt(0) + "."
                  : ""
              } ${player.lastName}`}
            </span>
          </div>
        </div>
      {/each}
    </div>

    <div class="items-center py-3 flex space-x-4 flex justify-end">
      <button
        class="brand-cancel-button"
        type="button"
        on:click={closeModal}
      >
        Cancel
      </button>
      <button class={`default-button brand-button`} on:click={closeModal}
        >Select</button
      >
    </div>
  </div>
</Modal>