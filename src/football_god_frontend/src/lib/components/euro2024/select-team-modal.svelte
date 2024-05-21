<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player.store";
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
      case 'ENG':
        return (await import('../flags/eng.svelte')).default as typeof SvelteComponent;

      case 'FRA':
        return (await import('../flags/fra.svelte')).default as typeof SvelteComponent;
      default:
        return null;
    }
  };

</script>

<Modal {visible} on:nnsClose={closeTeamSelectionModal}>
  <div class="p-2">
    <div class="flex justify-between items-center mb-4">
      <h3 class="default-header">Select Team</h3>
      <button class="times-button" on:click={closeTeamSelectionModal}>&times;</button>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {#each $teamStore as team, index (team.id)}
          <div class="team-card p-4 border rounded-md flex flex-col items-center">
            {#await getFlagComponent(team.countryCode) then FlagComponent}
              {#if FlagComponent}
                <svelte:component this={FlagComponent} />
              {/if}
            {/await}
            <p class="mt-2 text-center">{team.name}</p>
            <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded" on:click={() => confirmTeamSelection(team.id)}>Select</button>
          </div>
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
