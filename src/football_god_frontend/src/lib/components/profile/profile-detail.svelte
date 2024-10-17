<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/user-store";
  import { toastsError, toastsShow } from "$lib/stores/toasts-store";
  import UpdateUsernameModal from "$lib/components/profile/update-username-modal.svelte";
  import { Spinner } from "@dfinity/gix-components";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { writable } from "svelte/store";
  import WithdrawFplModal from "./withdraw-fpl-modal.svelte";

  let isLoading = true;
  let loadingBalances = true;

  let fplBalance = 0n;
  let fplBalanceFormatted = "0.0000"; 
  let dots = writable('.');
  let dot_interval: ReturnType<typeof setInterval>;

  let showUsernameModal = false;
  let showFPLModal = false;

  onMount(async () => {
    try {
      startDotAnimation();
      await userStore.sync();
      unsubscribeUserProfile = userStore.subscribe((value) => {
        if (!value) {
          return;
        }
      });
      isLoading = false;
      await fetchBalances();
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching profile detail." },
        err: error,
      });
      console.error("Error fetching profile detail:", error);
      isLoading = false;
    }
  });

  let unsubscribeUserProfile: () => void;

  function startDotAnimation(){
    let count = 1;
    dot_interval = setInterval(() => {
      count = (count % 3) + 1;
      dots.set('.'.repeat(count));
    }, 500);
  }
  
  function loadWithdrawFPLModal(){
    showFPLModal = true;
  };

  async function closeWithdrawFPLModal(){
    showFPLModal = false;
    startDotAnimation();
    await fetchBalances();
  };

  async function fetchBalances() {
    try {
      /*
      let userBalances = await userStore.getAccountBalances();
      if(userBalances){
        fplBalance = userBalances.fplBalance;
        fplBalanceFormatted = (Number(fplBalance) / 100_000_000).toFixed(4);
        clearInterval(dot_interval);
        loadingBalances = false;
      }
      */
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching profile detail." },
        err: error,
      });
      console.error("Error fetching profile detail:", error);
      clearInterval(dot_interval);
      loadingBalances = false;
    }
  }

  function displayUsernameModal(): void {
    showUsernameModal = true;
  }

  async function closeUsernameModal() {
    await userStore.cacheProfile();
    showUsernameModal = false;
  }

  function cancelUsernameModal() {
    showUsernameModal = false;
  }

  async function copyAndShowToast(textToCopy: string) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toastsShow({
        position: "bottom",
        text: "Copied to clipboard.",
        level: "success",
        duration: 2000,
      });

    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
</script>

{#if isLoading}
  <Spinner />
{:else}
  <UpdateUsernameModal
    newUsername={$userStore ? $userStore.username : ""}
    visible={showUsernameModal}
    closeModal={closeUsernameModal}
    cancelModal={cancelUsernameModal}
  />
  <WithdrawFplModal
    visible={showFPLModal}
    closeModal={closeWithdrawFPLModal}
    cancelModal={closeWithdrawFPLModal}
    fplBalance={fplBalance}
    fplBalanceFormatted={fplBalanceFormatted}
  />
  <div class="container mt-4 mx-6">
    <div class="flex flex-wrap">

      <div class="w-full mb-4 md:mb-0">
        <div class="mt-2 md:mt-1 rounded-lg">
          <p class="mb-1 text-xs">Display Name:</p>
          <h2 class="default-header mb-1 md:mb-2">
            {$userStore?.displayName == $userStore.principalName ? "Not Set" : $userStore?.displayName}
          </h2>
          <button
            class="text-sm md:text-sm p-1 md:p-2 px-2 md:px-4 rounded fg-button button-hover"
            on:click={displayUsernameModal}
          >
            Update
          </button>

          <p class="mb-1 mt-4 text-xs">Principal:</p>
          <div class="flex items-center">
            <button
              class="flex items-center text-left text-xxs break-all"
              on:click={() => copyAndShowToast($userStore.principalName)}
            >
              <span>{$userStore.principalName}</span>
              <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full mb-4">
        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="flex items-center p-4 rounded-lg shadow-md border border-gray-700"
            >
              <img
                src="/FPLCoin.png"
                alt="FPL"
                class="h-12 w-12 md:h-9 md:w-9"
              />
              <div class="ml-4 md:ml-3">

                  {#if loadingBalances}
                    <div class="dot-animation min-w-[20px]">{$dots}</div>
                  {:else}
                  <p>
                    {fplBalanceFormatted} FPL
                  </p>
                  {/if}

                <div class="flex items-center text-xs">
                  <button
                    class="flex items-center text-left break-all"
                    on:click={() => copyAndShowToast($userStore.fplDepositAddress)}
                  >
                    <span>{$userStore.fplDepositAddress}</span>
                    <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
                  </button>
                </div>


                {#if !loadingBalances}
                <div class="flex items-center text-xs mt-2">
                  <button
                  class="text-sm md:text-sm p-1 md:p-2 px-2 md:px-4 rounded fg-button button-hover"
                    on:click={loadWithdrawFPLModal}
                  >
                    Withdraw
                  </button>
                </div>
                {/if}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}