<script lang="ts">
    import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import RefreshIcon from "$lib/icons/RefreshIcon.svelte";
    import { toastsError, toastsShow } from "$lib/stores/toasts.store";
    import { userStore } from "$lib/stores/user.store";
import { Modal } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import type { AccountBalancesDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";

  export let visible: boolean;
  export let closeSelectionModal: () => void;
  export let confirmSubmit: () => void;
  let accountBalances: AccountBalancesDTO;

  let entryFee = 10_000_000_000n;
  let isLoading = true;
  

  onMount(async () => {
    try {
      await userStore.sync();
      let userBalances = await userStore.getAccountBalances();
      if(userBalances){
        accountBalances = userBalances;
      }

      if(!userBalances){
        accountBalances = {
          principalId: $userStore.princpialId,
          fplBalance: 0n,
          icpBalance: 0n
        }
      }
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching profile detail." },
        err: error,
      });
      console.error("Error fetching profile detail:", error);
    } finally {
      isLoading = false;
    }
  });


  async function copyAndShowToast(textToCopy: string) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toastsShow({
        position: "bottom",
        text: "Deposit Principal Copied.",
        level: "success",
        duration: 2000,
      });

    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  function refreshBalance () {
    //TODO: Add refresh
  }
</script>

<Modal {visible} on:nnsClose={closeSelectionModal}>
  <div class="px-8 pb-8 pt-4">
    <div class="flex justify-between items-center">
      <h3 class="default-header py-4">Confirm Entry</h3>
      <button class="times-button" on:click={closeSelectionModal}>&times;</button>
    </div>  
    {#if !isLoading}
    <div >
      <button on:click={refreshBalance}>
        <span class="flex flex-row items-center">
          <p class="py-4">Balance: {accountBalances.fplBalance} FPL</p>
          <RefreshIcon className="w-5 ml-2" />
        </span>
      </button>
       {#if accountBalances.fplBalance < entryFee}
        <p class="py-4">Please confirm you are happy to pay 100 FPL to enter the Euro 2024 sweepstake.</p>
        <button on:click={confirmSubmit} class="w-full bg-OPENFPLPURPLE rounded-md mt-8 px-4 py-2">Pay 100 FPL & Enter</button>
      {:else}
        <p>You will need 100 FPL to enter this competition, please deposit to your principal ID {$userStore.principalId}:</p>
        <button
          class="flex items-center text-left text-xxs break-all"
          on:click={() => copyAndShowToast($userStore.principalName)}
        >
          <span>{$userStore.principalName}</span>
          <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
        </button>
      {/if}
    </div>
    {/if}
  </div>  
</Modal>
