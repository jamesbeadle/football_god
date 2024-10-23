<script lang="ts">
    import { toastsError, toastsShow } from "$lib/stores/toasts-store";
    import { Modal, busyStore } from "@dfinity/gix-components";
    import type { UpdateSystemStateDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";
    import { adminStore } from "$lib/stores/admin-store";
    import { onMount } from "svelte";
  
    export let visible: boolean;
    export let closeModal: () => void;

    let applications = [
      {name: "OpenFPL", id: 1},
      {name: "OpenWSL", id: 2}
    ];

    let selectedApplicationId = 0;

    let calculationSeasonId: number;
    let calculationMonth: number;
    let calculationGameweek: number;
    let pickTeamSeasonId: number;
    let pickTeamMonth: number;
    let pickTeamGameweek: number;
    let transferWindowActive: boolean;
    let onHold: boolean;
    let seasonActive: boolean;
    let version: string;

    let isLoading = true;

    $: isSubmitDisabled = false;

    onMount(async () => {
      isLoading = false;
    });
    
    async function updateSystemState() {
      busyStore.startBusy({
        initiator: "update-system-state",
        text: "Updating system state...",
      });
      try {
        let dto: UpdateSystemStateDTO = {
          calculationGameweek,
          calculationMonth,
          calculationSeasonId,
          pickTeamGameweek,
          pickTeamSeasonId,
          pickTeamMonth,
          transferWindowActive,
          onHold,
          seasonActive,
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
        console.log("applicationName")
        console.log(applicationName)
        await adminStore.updateSystemState(applicationName, dto);

        await closeModal();
        toastsShow({
          text: "System State updated.",
          level: "success",
          duration: 2000,
        });
      } catch (error) {
        toastsError({
          msg: { text: "Error updating system state." },
          err: error,
        });
        console.error("Error updating system state:", error);
        closeModal();
      } finally {
        busyStore.stopBusy("update-name");
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
        console.log("applicationName")
        console.log(applicationName)

      let currentSystemState = await adminStore.getSystemState(applicationName);
      if(!currentSystemState){
        return;
      }
      calculationSeasonId = currentSystemState.calculationSeasonId;
      calculationMonth = currentSystemState.calculationMonth;
      calculationGameweek = currentSystemState.calculationGameweek;
      pickTeamSeasonId = currentSystemState.pickTeamSeasonId;
      pickTeamMonth = currentSystemState.pickTeamMonth;
      pickTeamGameweek = currentSystemState.pickTeamGameweek;
      transferWindowActive = currentSystemState.transferWindowActive;
      onHold = currentSystemState.onHold;
      seasonActive = currentSystemState.seasonActive;
      version = currentSystemState.version;
    }

  </script>
  
  <Modal {visible} on:nnsClose={closeModal}>
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
            <p class="py-2">Calculation Gameweek:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Calculation Gameweek"
              bind:value={calculationGameweek}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Calculation Month:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Calculation Month"
              bind:value={calculationMonth}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Calculation Season:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Calculation Season"
              bind:value={calculationSeasonId}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Pick Team Gameweek:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Pick Team Gameweek"
              bind:value={pickTeamGameweek}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Pick Team Month:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Pick Team Month"
              bind:value={pickTeamMonth}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Pick Team Season:</p>

            <input
              type="number"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Pick Team Season"
              bind:value={pickTeamSeasonId}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Transfer Window Active:</p>

              <input
              type="checkbox"
              class="form-checkbox h-5 w-5"
              checked={transferWindowActive}
              bind:value={transferWindowActive}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">On Hold:</p>

              <input
              type="checkbox"
              class="form-checkbox h-5 w-5"
              checked={onHold}
              bind:value={onHold}
            />
          </div>

          <div class="flex-col space-y-2">
            <p class="py-2">Season Active:</p>

              <input
              type="checkbox"
              class="form-checkbox h-5 w-5"
              checked={seasonActive}
              bind:value={seasonActive}
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
            on:click={updateSystemState}
            disabled={isSubmitDisabled}
          >
            Update
          </button>
        </div>
      {/if}
    </div>
  </Modal>
  