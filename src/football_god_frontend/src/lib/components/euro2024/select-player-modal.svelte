<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import { teamStore } from "$lib/stores/teams.store";
  import type { SvelteComponent } from "svelte";
    import type { Position } from "../../../../../declarations/football_god_backend/football_god_backend.did";

  export let visible: boolean;
  export let confirmPlayerSelection: (playerId: number) => void;
  export let closePlayerSelectionModal: () => void;

  let isLoading = true;
  let showPlayers = false;
  let selectedTeamId = 0;
  $: teamPlayers = (selectedTeamId > 0) ? $playerStore.filter(x => x.teamId == selectedTeamId) : [];

  onMount(async () => {
    try {
      await teamStore.sync();
      if ($teamStore.length == 0) return;
      await playerStore.sync();
      if ($playerStore.length == 0) return;
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching add player data." },
        err: error,
      });
      console.error("Error fetching add player data:", error);
    } finally {
      isLoading = false;
    }
  });

  const getFlagComponent = async (countryCode: string): Promise<typeof SvelteComponent | null> => {
    switch (countryCode) {
      // Add your cases here for each country code
      default:
        return null;
    }
  };

  function selectTeam(teamId: number) {
    selectedTeamId = teamId;
    showPlayers = true;
  }

  const positions: { [key: string]: string } = {
    Goalkeeper: "GK",
    Defender: "DF",
    Midfielder: "MF",
    Forward: "FW"
  };

  function getPositionKey(position: Position): string {
    if ('Goalkeeper' in position) return 'Goalkeeper';
    if ('Defender' in position) return 'Defender';
    if ('Midfielder' in position) return 'Midfielder';
    if ('Forward' in position) return 'Forward';
    return '';
  }

  function groupedPlayers() {
    return Object.keys(positions).map(positionKey => ({
      position: positions[positionKey],
      players: teamPlayers.filter(player => getPositionKey(player.position) === positionKey)
    }));
  }

</script>


<Modal {visible} on:nnsClose={closePlayerSelectionModal}>
  <div class="p-8">
    <div class="flex justify-between items-center mb-4">
      <h3 class="default-header py-4">Select Team</h3>
      <button class="times-button" on:click={closePlayerSelectionModal}>&times;</button>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    {:else}
      {#if showPlayers}
        <div>
          {#each groupedPlayers() as group}
            {#if group.players.length > 0}
              <h4 class="mt-4">{group.position}</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
                {#each group.players as player}
                  {@const team = $teamStore.find(x => x.id == player.teamId)}
                  <button on:click={() => confirmPlayerSelection(player.id)}>
                    <div class="team-card p-4 border rounded-md flex flex-col items-center hover:bg-red-500">
                      {#if team}
                        {#await getFlagComponent(team.countryCode) then FlagComponent}
                          {#if FlagComponent}
                            <svelte:component this={FlagComponent} />
                          {/if}
                        {/await}
                        <p class="mt-2 text-center">{team.name}</p>
                        <p class="mt-1">{player.firstName} {player.lastName}</p>
                        <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded">Select</button>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
          {#each $teamStore as team, index (team.id)}
            <button on:click={() => selectTeam(team.id)}>
              <div class="team-card p-4 border rounded-md flex flex-col items-center hover:bg-red-500">
                {#await getFlagComponent(team.countryCode) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} />
                  {/if}
                {/await}
                <p class="mt-2 text-center">{team.name}</p>
                <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded">Select</button>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</Modal>

<style>
  .team-card {
    background-color: blue;
  }
</style>