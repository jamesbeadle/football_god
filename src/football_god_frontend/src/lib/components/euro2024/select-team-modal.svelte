<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import { toastsError } from "$lib/stores/toasts.store";
  import { teamStore } from "$lib/stores/teams.store";
  import type { SvelteComponent } from "svelte";

  export let visible: boolean;

  export let confirmTeamSelection: (teamId: number) => void;
  export let closeTeamSelectionModal: () => void;

  let isLoading = true;

  onMount(async () => {
    try {
      await teamStore.sync();
      if ($teamStore.length == 0) return;
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
        return (await import('../flags/den.svelte')).default as typeof SvelteComponent;
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
      case 'SVI':
        return (await import('../flags/svi.svelte')).default as typeof SvelteComponent;
      case 'SKA':
        return (await import('../flags/ska.svelte')).default as typeof SvelteComponent;
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

</script>

<Modal {visible} on:nnsClose={closeTeamSelectionModal}>
  <div class="p-8">
    <div class="flex justify-between items-center mb-4">
      <h3 class="default-header py-4">Select Team</h3>
      <button class="times-button" on:click={closeTeamSelectionModal}>&times;</button>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
        {#each $teamStore as team, index (team.id)}
          <button on:click={() => confirmTeamSelection(team.id)}>
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
  </div>
</Modal>

<style>
  .team-card {
    background-color: blue;
  }
</style>
