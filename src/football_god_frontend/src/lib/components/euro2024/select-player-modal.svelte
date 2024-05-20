<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import { teamStore } from "$lib/stores/teams.store";

  export let confirmPlayerSelection: (playerId: number) => void;
  export let visible: boolean;
  export let closePlayerSelectionModal: () => void;
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
</script>

<Modal {visible} on:nnsClose={closePlayerSelectionModal}>
  <div class="p-2">
    <div class="flex justify-between items-center">
      <h3 class="default-header">Select Player</h3>
      <button class="times-button" on:click={closePlayerSelectionModal}
        >&times;</button
      >
    </div>

    print all the teams and player out to select from
    {#each $teamStore as team, index}
      <p>team.name</p>
    {/each}
  </div>
</Modal>

<style>
  .active {
    background-color: #2ce3a6;
    color: white;
  }
</style>
