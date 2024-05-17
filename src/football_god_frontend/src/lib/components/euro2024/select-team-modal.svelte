<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let visible: boolean;

  export let confirmTeamSelection: (teamId: number) => void;
  export let closeTeamSelectionModal: () => void;
  
  let isLoading = true;

  /*
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
  */
</script>

<Modal {visible} on:nnsClose={closeTeamSelectionModal}>
  <div class="p-2">
    <div class="flex justify-between items-center">
      <h3 class="default-header">Select Player</h3>
      <button class="times-button" on:click={closeTeamSelectionModal}
        >&times;</button
      >
    </div>
    <!--

    {#each $teamStore as team, index}
      {/each}

    -->  
  </div>
</Modal>

<style>
  .active {
    background-color: #2ce3a6;
    color: white;
  }
</style>
