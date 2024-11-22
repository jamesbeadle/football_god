<script lang="ts">
    import { adminStore } from "$lib/stores/admin-store";
    import { onMount } from "svelte";
    import Modal from "../shared/modal.svelte";
  
    export let visible: boolean;
    export let closeModal: () => void;

    let applications = [
      {name: "OpenFPL", id: 1},
      {name: "OpenWSL", id: 2}
    ];

    let selectedApplicationId = 0;
    
    let isLoading = true;

    $: isSubmitDisabled = false;

    onMount(async () => {
      isLoading = false;
    });
    
    async function calculateLeaderboards() {
      try {
        let applicationName = "";

        switch(selectedApplicationId){
            case 1:
              applicationName = "OpenFPL";
              break;
            case 2:
              applicationName = "OpenWSL";
              break;
            default: 
              return;
        }
        
        await adminStore.calculateLeaderboards(applicationName);

        await closeModal();
      } catch (error) {
        console.error("Error calculating leaderboards:", error);
        closeModal();
      } finally {
      }
    }

  </script>
  
  <Modal showModal={visible} onClose={closeModal}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Calculate Leaderboards</h3>
        <button class="times-button" on:click={closeModal}>&times;</button>
      </div>

      <select
        class="p-2 brand-dropdown min-w-[100px]"
        bind:value={selectedApplicationId}
      >
        <option value={0}>Select Application</option>
        {#each applications as application}
          <option value={application.id}>{application.name}</option>
        {/each}
      </select>

      {#if selectedApplicationId > 0}
        
        <div class="border-b border-gray-200" />

        <div class="items-center flex space-x-4">
          <button
            class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]"
            type="button"
            on:click={closeModal}
          >
            Cancel
          </button>
          <button
            class={`${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`}
            on:click={calculateLeaderboards}
            disabled={isSubmitDisabled}
          >
            Calculate
          </button>
        </div>
      {/if}
    </div>
  </Modal>
  