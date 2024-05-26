<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/user.store";
  import { toastsError, toastsShow } from "$lib/stores/toasts.store";
  import UpdateUsernameModal from "$lib/components/profile/update-username-modal.svelte";
  import { busyStore, Spinner } from "@dfinity/gix-components";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { uint8ArrayToHexString } from "@dfinity/utils";
    import type { AccountBalancesDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";

  let showUsernameModal: boolean = false;
  let fileInput: HTMLInputElement;
  let accountBalances: AccountBalancesDTO = {
    principalId: "",
    fplBalance: 0n,
    icpBalance: 0n
  };
  
  let unsubscribeUserProfile: () => void;

  let isLoading = true;

  onMount(async () => {
    try {
      await userStore.sync();
      console.log($userStore)
      unsubscribeUserProfile = userStore.subscribe((value) => {
        if (!value) {
          return;
        }
      });
      let userBalances = await userStore.getAccountBalances();
      console.log(userBalances)
      if(userBalances){
        accountBalances = {
          principalId: userBalances.principalId,
          fplBalance: userBalances.fplBalance,
          icpBalance: userBalances.icpBalance
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
                <p>0.00 ICP</p>

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
                <p>{ (accountBalances.fplBalance/ 10_0000_000n).toLocaleString()} FPL</p>

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

<style>
  .file-upload-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
  }

  .btn-file-upload {
    width: 100%;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    text-align: center;
    display: block;
  }

  input[type="file"] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
</style>
