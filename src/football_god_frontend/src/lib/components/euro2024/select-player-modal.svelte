<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { SvelteComponent, onMount } from "svelte";
  import { toastsError } from "$lib/stores/toasts.store";
  import type { InternationalPlayer, InternationalTeam, Position } from "../../../../../declarations/football_god_backend/football_god_backend.did";
    
  export let visible: boolean;
  export let confirmPlayerSelection: (playerId: number) => void;
  export let closePlayerSelectionModal: () => void;
  export let teams: InternationalTeam[];
  export let players: InternationalPlayer[];

  let isLoading = true;
  let showPlayers = false;
  let selectedTeamId = 0;
  $: teamPlayers = (selectedTeamId > 0) ? players.filter(x => x.teamId == selectedTeamId) : [];

  onMount(async () => {
    try {
      if (teams.length == 0) return;
      if (players.length == 0) return;
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

  const getFlagComponent = async (countryCode: string): Promise<typeof SvelteComponent | null> => {
    switch (countryCode) {
      case 'ALB':
        return (await import('../flags/alb.svelte')).default as typeof SvelteComponent;
      case 'AUS':
        return (await import('../flags/aus.svelte')).default as typeof SvelteComponent;
      case 'BEL':
        return (await import('../flags/bel.svelte')).default as typeof SvelteComponent;
      case 'CRO':
        return (await import('../flags/cro.svelte')).default as typeof SvelteComponent;
      case 'CZE':
        return (await import('../flags/cze.svelte')).default as typeof SvelteComponent;
      case 'DEN':
        return (await import('../flags/den.svelte')).default as typeof SvelteComponent;
      case 'ENG':
        return (await import('../flags/eng.svelte')).default as typeof SvelteComponent;
      case 'FRA':
        return (await import('../flags/fra.svelte')).default as typeof SvelteComponent;
      case 'GEO':
        return (await import('../flags/geo.svelte')).default as typeof SvelteComponent;
      case 'GER':
        return (await import('../flags/ger.svelte')).default as typeof SvelteComponent;
      case 'HUN':
        return (await import('../flags/hun.svelte')).default as typeof SvelteComponent;
      case 'ITA':
        return (await import('../flags/ita.svelte')).default as typeof SvelteComponent;
      case 'NED':
        return (await import('../flags/ned.svelte')).default as typeof SvelteComponent;
      case 'POL':
        return (await import('../flags/pol.svelte')).default as typeof SvelteComponent;
      case 'POR':
        return (await import('../flags/por.svelte')).default as typeof SvelteComponent;
      case 'ROM':
        return (await import('../flags/rom.svelte')).default as typeof SvelteComponent;
      case 'SCO':
        return (await import('../flags/sco.svelte')).default as typeof SvelteComponent;
      case 'SER':
        return (await import('../flags/ser.svelte')).default as typeof SvelteComponent;
      case 'SKA':
        return (await import('../flags/ska.svelte')).default as typeof SvelteComponent;
      case 'SVI':
        return (await import('../flags/svi.svelte')).default as typeof SvelteComponent;
      case 'SPA':
        return (await import('../flags/spa.svelte')).default as typeof SvelteComponent;
      case 'SWI':
        return (await import('../flags/swi.svelte')).default as typeof SvelteComponent;
      case 'TUR':
        return (await import('../flags/tur.svelte')).default as typeof SvelteComponent;
      case 'UKR':
        return (await import('../flags/ukr.svelte')).default as typeof SvelteComponent;
      default:
        return null;
    }
  };

  function goBackToTeams() {
    showPlayers = false;
  }

  const positionHeaders: { [key: string]: string } = {
    GK: "Goalkeepers",
    DF: "Defenders",
    MF: "Midfielders",
    FW: "Forwards"
  };

  function getPositionText(position: Position): string {
    if ('Goalkeeper' in position) return positions.Goalkeeper;
    if ('Defender' in position) return positions.Defender;
    if ('Midfielder' in position) return positions.Midfielder;
    if ('Forward' in position) return positions.Forward;
    return '';
  }



</script>

<Modal {visible} on:nnsClose={closePlayerSelectionModal}>
  <div class="p-8">
    
    {#if isLoading}
      <div class="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    {:else}
      {#if showPlayers}
      <div class="flex justify-between items-center mb-4">
        <button class="mr-2" on:click={goBackToTeams}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 class="default-header py-4">Select Player</h3>
        <button class="times-button" on:click={closePlayerSelectionModal}>&times;</button>
      </div>
      <div>
        {#each groupedPlayers() as group}
          {#if group.players.length > 0}
            <h4 class="my-4 mt-8">{positionHeaders[group.position]}</h4>
            <div class="flex flex-col gap-4">
              {#each group.players as player}
                {@const team = teams.find(x => x.id == player.teamId)}
                <button on:click={() => confirmPlayerSelection(player.id)} class="flex items-center p-4 border rounded-md hover:bg-OPENFPLPURPLE">
                  {#if team}
                    <div class="flex flex-col">
                      <p class="mr-4">{getPositionText(player.position)}</p>
                    </div>
                    {#await getFlagComponent(team.countryCode) then FlagComponent}
                      {#if FlagComponent}
                        <svelte:component this={FlagComponent} className="w-8 h-8"/>
                      {/if}
                    {/await}
                    <div class="flex flex-col">
                      <p class="ml-4">{player.firstName} {player.lastName}</p>
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        {/each}

        </div>
      {:else}
        <div class="flex justify-between items-center mb-4">
          <h3 class="default-header py-4">Select Player's Team</h3>
          <button class="times-button" on:click={closePlayerSelectionModal}>&times;</button>
        </div>  
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
          
          {#each teams as team, index (team.id)}
            <button on:click={() => selectTeam(team.id)}>
              <div class="team-card bg-OPENFPLPURPLE p-4 border rounded-md flex flex-col items-center hover:bg-OPENFPL">
                {#await getFlagComponent(team.countryCode) then FlagComponent}
                  {#if FlagComponent}
                    <svelte:component this={FlagComponent} className="w-16 h-16" />
                  {/if}
                {/await}
                <p class="mt-2 text-center">{team.name}</p>
                <button class="select-button mt-2 bg-OPENFPL text-GRAY px-2 py-1 rounded">Select</button>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</Modal>

<style>
  .team-card:hover .select-button {
    background-color: var(--bg-OPENFPLPURPLE);
  }
</style>
