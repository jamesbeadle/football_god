<script lang="ts">
    import { adminStore } from "$lib/stores/admin-store";
    import { onMount } from "svelte";
    import Modal from "../shared/modal.svelte";
    import { leagueStore } from "$lib/stores/league-store";
  
    export let visible: boolean;
    export let closeModal: () => void;

    let applications = [
      {name: "OpenFPL", id: 1, gameweeks: 38},
      {name: "OpenWSL", id: 2, gameweeks: 22}
    ];

    let gameweeks: number[] = [];

    let selectedApplicationId = 1;
    let selectedGameweek = 1;
    
    let isLoading = true;

    $: isSubmitDisabled = false;

    onMount(async () => {
      isLoading = false;
      let leagueStatus = await leagueStore.getLeagueStatus(applications.find(x => x.id == selectedApplicationId)!.id);
      selectedGameweek = leagueStatus?.activeGameweek ?? 1;
      setGameweeks();
    });

    function setGameweeks(){
      let totalGameweeks = applications.find(x => x.id == selectedApplicationId)!.gameweeks;
      gameweeks = Array.from({ length: totalGameweeks }, (_, i) => i + 1);
    }
    
    async function calculateWeeklyRewards() {
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
        
        await adminStore.calculateWeeklyRewards(applicationName, selectedGameweek);

        await closeModal();
      } catch (error) {
        console.error("Error weekly rewards:", error);
        closeModal();
      } finally {
      }
    }

  </script>
  
  <Modal showModal={visible} onClose={closeModal}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Calculate Weekly Rewards</h3>
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

        <div class="flex-col space-y-2">
          <p>Select Gameweek:</p>
          <select
            class="p-2 brand-dropdown my-4 min-w-[100px]"
            bind:value={selectedGameweek}
          >
            <option value={0}>Select Gameweek</option>
            {#each gameweeks as gameweek}
              <option value={gameweek}>Gameweek {gameweek}</option>
            {/each}
          </select>
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
            on:click={calculateWeeklyRewards}
            disabled={isSubmitDisabled}
          >
            Calculate
          </button>
        </div>
      {/if}
    </div>
  </Modal>
  