<script lang="ts">
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import RefreshIcon from "$lib/icons/RefreshIcon.svelte";
  import { toastsError, toastsShow } from "$lib/stores/toasts.store";
  import { userStore } from "$lib/stores/user.store";
  import { Modal, Spinner } from "@dfinity/gix-components";
  import { onMount } from "svelte";
  import type { AccountBalancesDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";
  import { writable } from "svelte/store";

  export let visible: boolean;
  export let closeSelectionModal: () => void;
  export let confirmSubmit: () => void;
  let accountBalances: AccountBalancesDTO;
  let fplBalance = "0";

  let entryFee = 10_000_000_000n;
  let isLoading = true;
  let dots = writable('.');
  let dot_interval;
  let refreshingBalance = false;
  
  onMount(async () => {
    try {
      await userStore.sync();
      let userBalances = await userStore.getAccountBalances();
      if(userBalances){
        accountBalances = userBalances;
        fplBalance = Number(accountBalances.fplBalance / 100_000_000n).toPrecision(4);
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

  async function refreshBalance () {

    refreshingBalance = true;
    let count = 1;
    dot_interval = setInterval(() => {
      count = (count % 3) + 1;
      dots.set('.'.repeat(count));
    }, 500);

    let userBalances = await userStore.getAccountBalances();
    if(userBalances){
      accountBalances = userBalances;
      fplBalance = Number(accountBalances.fplBalance / 100_000_000n).toPrecision(4);
    }

    refreshingBalance = false;
    clearInterval(dot_interval);
  }
</script>

<Modal {visible} on:nnsClose={closeSelectionModal}>
  <div class="px-8 pb-4 pt-4">
    <div class="flex justify-between items-center">
      <h3 class="default-header py-4">Confirm Entry</h3>
      <button class="times-button" on:click={closeSelectionModal}>&times;</button>
    </div>  
    <div >
      {#if isLoading}
        <p class="py-4">Please wait, checking your FPL balance.</p>
      {:else}
      <button on:click={refreshBalance} class="mb-4">
        <span class="flex flex-row items-center">
          {#if isLoading}
            <p class="py-4">Loading Balance</p>
          {:else}
            <p class="py-4">Balance: 
              {#if refreshingBalance}
                {$dots}
              {:else}
                {fplBalance} FPL
              {/if}
            </p>
          {/if}
          <RefreshIcon className="w-5 ml-2" />
        </span>
      </button>
        {#if accountBalances.fplBalance >= entryFee}
          <p>Please confirm you are happy to pay 100 FPL to enter the Euro 2024 sweepstake.</p>
          <button on:click={confirmSubmit} class="w-full bg-OPENFPLPURPLE rounded-md my-8 px-4 py-2">Pay 100 FPL & Enter</button>
        {:else}
          <p>You will need 100 FPL to enter this competition, please deposit to your principal ID:</p>
          <button
            class="flex items-center text-left text-sm break-all my-4 py-2"
            on:click={() => copyAndShowToast($userStore.principalName)}
          >
            <span>{$userStore.principalName}</span>
            <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
          </button>
        {/if}
      {/if}
    </div>
  </div>  
</Modal>
