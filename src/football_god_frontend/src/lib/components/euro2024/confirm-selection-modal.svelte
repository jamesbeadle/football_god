<script lang="ts">
  import { Modal } from "@dfinity/gix-components";
  import { SvelteComponent, onMount } from "svelte";
  import { toastsError, toastsShow } from "$lib/stores/toasts.store";
  import type { Euro2024PredictionDTO, InternationalPlayer, InternationalTeam, Position } from "../../../../../declarations/football_god_backend/football_god_backend.did";
    import { userStore } from "$lib/stores/user.store";
    import { isError } from "$lib/utils/helpers";
    
  export let visible: boolean;
  export let closeSelectionModal: () => void;
  export let confirmSubmit: () => void;
  
</script>

<Modal {visible} on:nnsClose={closeSelectionModal}>
  <div class="px-8 pb-8 pt-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="default-header py-4">Confirm Entry</h3>
      <button class="times-button" on:click={closeSelectionModal}>&times;</button>
    </div>  
    <div >
      <p>Please confirm you are happy to pay 100 FPL to enter the Euro 2024 sweepstake.</p>
      
      <button on:click={confirmSubmit} class="w-full bg-OPENFPLPURPLE rounded-md mt-8 px-4 py-2">Pay 100 FPL & Enter</button>
    </div>
  </div>  
</Modal>

<style>
  .team-card:hover .select-button {
    background-color: var(--bg-OPENFPLPURPLE);
  }
</style>
