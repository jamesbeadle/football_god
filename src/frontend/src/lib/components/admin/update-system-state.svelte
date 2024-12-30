<script lang="ts">
    import type { UpdateAppStatusDTO } from "../../../../../declarations/backend/backend.did";
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

    let onHold: boolean;
    let version: string;

    let isLoading = true;

    $: isSubmitDisabled = false;

    onMount(async () => {
      isLoading = false;
    });
    
    async function updateSystemState() {
      try {
        let dto: UpdateAppStatusDTO = {
          onHold,
          version
        };

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
        await adminStore.updateSystemState(applicationName, dto);

        await closeModal();
      } catch (error) {
        console.error("Error updating system state:", error);
        closeModal();
      } finally {
      }
    }

    $: if (selectedApplicationId > 0){
      isLoading = true;
      loadSystemState();
      isLoading = false;
    }

    async function loadSystemState() {
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

      let currentSystemState = await adminStore.getSystemState(applicationName);
      if(!currentSystemState){
        return;
      }
      onHold = currentSystemState.onHold;
      version = currentSystemState.version;
    }

  </script>
  
  <Modal showModal={visible} onClose={closeModal}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Update System State</h3>
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
        <div class="w-full flex-col space-y-4 mb-2">
          
          <div class="flex-col space-y-2">
            <p class="py-2">On Hold:</p>

              <input
              type="checkbox"
              class="form-checkbox h-5 w-5"
              bind:checked={onHold}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Version:</p>

            <input
              type="text"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Version"
              bind:value={version}
            />
          </div>
        </div>

        <div class="items-center flex space-x-4">
          <button
            class="px-4 py-2 brand-cancel-button min-w-[150px]"
            type="button"
            on:click={closeModal}
          >
            Cancel
          </button>
          <button
            class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                        px-4 py-2 min-w-[150px]`}
            on:click={updateSystemState}
            disabled={isSubmitDisabled}
          >
            Update
          </button>
        </div>
      {/if}
    </div>
  </Modal>
  