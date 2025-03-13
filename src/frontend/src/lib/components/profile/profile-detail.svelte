<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/user-store";
  import UpdateUsernameModal from "$lib/components/profile/update-username-modal.svelte";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { writable } from "svelte/store";
  import WithdrawFplModal from "./withdraw-fpl-modal.svelte";
  import { authStore } from "$lib/stores/auth-store";
  import FullScreenSpinner from "../shared/full-screen-spinner.svelte";
  import type { ProfileDTO } from "../../../../../declarations/backend/backend.did";
  import { toasts } from "$lib/stores/toasts-store";
   
  let isLoading = true;
  let loadingBalances = true;

  let fplBalance = 0n;
  let fplBalanceFormatted = "0.0000"; 
  let dots = writable('.');
  let dot_interval: ReturnType<typeof setInterval>;
  let principalId = "";
  let profile: ProfileDTO | null = null;

  let showUsernameModal = false;
  let showFPLModal = false;

  onMount(async () => {
    try {
      startDotAnimation();
      await userStore.sync();
      await authStore.sync();
      principalId = $authStore.identity?.getPrincipal().toText() ?? "";
      unsubscribeUserProfile = userStore.subscribe((value) => {
        if (!value) {
          return;
        }
        profile = value;
      });
      unsubscribeUserProfile();
      isLoading = false;
      await fetchBalances();
    } catch (error) {
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
      let fplBalance = await userStore.getFPLBalance();
      fplBalanceFormatted = (Number(fplBalance) / 100_000_000).toFixed(4);
    } catch (error) {
      console.error("Error fetching profile detail:", error);
    } finally {
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

  async function copyTextAndShowToast(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toasts.addToast({
        type: "success",
        message: "Copied to clipboard.",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

</script>

{#if isLoading}
  <FullScreenSpinner />
{:else}
  {#if showUsernameModal}
    <UpdateUsernameModal
      newUsername={$userStore ? $userStore.username : ""}
      visible={showUsernameModal}
      closeModal={closeUsernameModal}
      cancelModal={cancelUsernameModal}
    />
  {/if}
  {#if showFPLModal}
    <WithdrawFplModal
      visible={showFPLModal}
      closeModal={closeWithdrawFPLModal}
      cancelModal={closeWithdrawFPLModal}
      fplBalance={fplBalance}
      fplBalanceFormatted={fplBalanceFormatted}
    />
  {/if}
  <div class="container mx-6 mt-4">
    <div class="flex flex-wrap">
      <div class="w-full mb-4 md:mb-0">
        <div class="mt-2 rounded-lg md:mt-1">
          <p class="mb-1 text-xs">Username:</p>
          <h2 class="mb-1 default-header md:mb-2">
            {profile == null || profile.username == "" ? "Not Set" : profile.username}
          </h2>
          <button
            class="p-1 px-2 text-sm rounded md:text-sm md:p-2 md:px-4 fg-button button-hover"
            on:click={displayUsernameModal}
          >
            Update
          </button>

          <p class="mt-4 mb-1 text-xs">Principal:</p>
          <div class="flex items-center">
            <button
              class="flex items-center text-left break-all text-xxs"
              on:click={() => copyTextAndShowToast(principalId)}
            >
              <span>{ principalId }</span>
              <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full mb-4">
        <div class="mt-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              class="flex items-center p-4 border border-gray-700 rounded-lg shadow-md"
            >
              <img
                src="/FPLCoin.png"
                alt="FPL"
                class="w-12 h-12 md:h-9 md:w-9"
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
                    on:click={() => copyTextAndShowToast(principalId)}
                  >
                    <span>{principalId}</span>
                    <CopyIcon className="w-7 xs:w-6 text-left" fill="#FFFFFF" />
                  </button>
                </div>


                {#if !loadingBalances}
                <div class="flex items-center mt-2 text-xs">
                  <button
                  class="p-1 px-2 text-sm rounded md:text-sm md:p-2 md:px-4 fg-button button-hover"
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