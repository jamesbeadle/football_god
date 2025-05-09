<script lang="ts">
  import { type Writable } from "svelte/store";
  import { convertPlayerPosition } from "$lib/utils/helpers";
  import type { Club, Player, PlayerEventData } from "../../../../../declarations/backend/backend.did";
  import Modal from "../shared/global/modal.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  
  interface Props {
    selectedTeam: Club;
    teamPlayers: Player[];
    selectedPlayers: Writable<Player[]>;
    playerEventData: Writable<PlayerEventData[]>;
    visible: boolean;
    closeModal: () => void;
  }

  let { selectedTeam, teamPlayers, selectedPlayers, playerEventData, visible, closeModal }: Props = $props();
  
  function handlePlayerSelection(event: Event, player: Player) {
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
</script>

<Modal title="Select Players" onClose={closeModal}>
  <div class="p-4 mx-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <BadgeIcon
          className="h-8"
          primaryColour={selectedTeam?.primaryColourHex}
          secondaryColour={selectedTeam?.secondaryColourHex}
          thirdColour={selectedTeam?.thirdColourHex}
        />
        <h3 class="text-xl font-medium">Select {selectedTeam?.friendlyName} Players</h3>
      </div>
      <button class="times-button" onclick={closeModal}>&times;</button>
    </div>
    <div class="mb-4 border-b border-gray-700"></div>
    <div class="grid grid-cols-1 my-2 gap-y-2 sm:grid-cols-2 gap-x-2">
      {#each teamPlayers.sort((a, b) => convertPlayerPosition(a.position) - convertPlayerPosition(b.position)) as player}
        {@const selected = $selectedPlayers.some((p) => p.id === player.id)}
        <div class="flex flex-row items-center justify-between p-2 space-x-1 text-xs border rounded-md border-BrandPurple/60 hover:bg-BrandPurple/10">
          <div class="w-1/12">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="w-5 h-5 mr-2 rounded-sm border-white/50 bg-BrandDarkGray text-BrandPurple/60 focus:ring-BrandPurple/60 focus:ring-offset-0"
                checked={selected}
                onchange={(e) => {
                  handlePlayerSelection(e, player);
                }}
              />
            </label>
          </div>
          <div class="flex justify-center w-2/12 font-medium text-gray-400">
            <span>
              {#if Object.keys(player.position)[0] == "Goalkeeper"}GK{/if}
              {#if Object.keys(player.position)[0] == "Defender"}DF{/if}
              {#if Object.keys(player.position)[0] == "Midfielder"}MF{/if}
              {#if Object.keys(player.position)[0] == "Forward"}FW{/if}
            </span>
          </div>
          <div class="flex flex font-medium">
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

    <div class="flex items-center justify-end py-3 space-x-4">
      <button
        class="brand-cancel-button"
        type="button"
        onclick={closeModal}
      >
        Cancel
      </button>
      <button class={`default-button brand-button`} onclick={closeModal}
        >Select</button
      >
    </div>
  </div>
</Modal>