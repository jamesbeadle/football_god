<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/user.store";
  import { toastsError, toastsShow } from "$lib/stores/toasts.store";
  import UpdateUsernameModal from "$lib/components/profile/update-username-modal.svelte";
  import { Spinner } from "@dfinity/gix-components";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { uint8ArrayToHexString } from "@dfinity/utils";
  import type { AccountBalancesDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";
  import { writable } from "svelte/store";

  let showUsernameModal: boolean = false;
  let accountBalances: AccountBalancesDTO = {
    principalId: "",
    fplBalance: 0n,
    icpBalance: 0n
  };
  let fplBalance = "0";
  let icpBalance = "0";
  
  let unsubscribeUserProfile: () => void;

  let isLoading = true;
  let loadingBalances = true;

  let dots = writable('.');
  let dot_interval;

  onMount(async () => {
    try {
      let count = 1;
      dot_interval = setInterval(() => {
        count = (count % 3) + 1;
        dots.set('.'.repeat(count));
      }, 500);

      await userStore.sync();
      unsubscribeUserProfile = userStore.subscribe((value) => {
        if (!value) {
          return;
        }
      });
      isLoading = false;
      let userBalances = await userStore.getAccountBalances();
      if(userBalances){
        accountBalances = {
          principalId: userBalances.principalId,
          fplBalance: userBalances.fplBalance,
          icpBalance: userBalances.icpBalance
        }
        fplBalance = (Number(accountBalances.fplBalance) / 100_000_000).toPrecision(4);
        icpBalance = (Number(accountBalances.icpBalance) / 100_000_000).toPrecision(4);
        clearInterval(dot_interval);
        loadingBalances = false;
      }
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching profile detail." },
        err: error,
      });
      console.error("Error fetching profile detail:", error);
      isLoading = false;
    }
  });

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
            <!--
            <div
              class="flex items-center p-4 md:p-2 rounded-lg shadow-md border border-gray-700"
            >
              <img
                src="/ICPCoin.png"
                alt="ICP"
                class="h-12 w-12 md:h-9 md:w-9"
              />
              <div class="ml-4 md:ml-3">
                <p class="font-bold">ICP</p>

                <p>
                  {#if loadingBalances}
                    <div class="dot-animation min-w-[20px]">{$dots}</div>
                  {:else}
                    {icpBalance} ICP
                  {/if}
                </p>

                <div class="flex items-center text-xs">
                  <button
                    class="flex items-center text-left break-all"
                    on:click={() => copyAndShowToast(uint8ArrayToHexString($userStore.depositAddress))}
                  >
                    <span>{uint8ArrayToHexString($userStore.depositAddress)}</span>
                    <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
                  </button>
                </div>
              </div>
            </div>
            -->
            <div
              class="flex items-center p-4 rounded-lg shadow-md border border-gray-700"
            >
              <img
                src="/FPLCoin.png"
                alt="FPL"
                class="h-12 w-12 md:h-9 md:w-9"
              />
              <div class="ml-4 md:ml-3">
                <p class="font-bold">FPL</p>

                <p>
                  {#if loadingBalances}
                    <div class="dot-animation min-w-[20px]">{$dots}</div>
                  {:else}
                    {fplBalance} FPL
                  {/if}
                </p>

                <div class="flex items-center text-xs">
                  <button
                    class="flex items-center text-left break-all"
                    on:click={() => copyAndShowToast($userStore.fplDepositAddress)}
                  >
                    <span>{$userStore.fplDepositAddress}</span>
                    <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
