<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/user-store";
  import UpdateUsernameModal from "$lib/components/profile/update-username-modal.svelte";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { writable } from "svelte/store";
  import WithdrawFplModal from "./withdraw-fpl-modal.svelte";
    import { authStore } from "$lib/stores/auth-store";
    import FullScreenSpinner from "../shared/full-screen-spinner.svelte";
    import { SHUFTI_CLIENT_ID, SHUFTI_SECRET_KEY } from "$lib/environment/environment";
    import { kycStore } from "$lib/stores/kyc-store";
    import type { ProfileDTO } from "../../../../../declarations/backend/backend.did";

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

  let kycComplete = false;
  let loadingKYC = false;

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
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
   
  async function beginKYC() {
    try {
      loadingKYC = true;
      let reference = crypto.randomUUID();
      await kycStore.storeKYCReference(reference);
      const payload = {
        reference: `SP_REQUEST_${reference}`,
        callback_url: "https://us-central1-openfpl1.cloudfunctions.net/api/forwardKYCResponse",
        redirect_url: "https://footballgod.xyz/profile",
        country: "GB",
        language: "EN",
        verification_mode: "any",
        ttl: 60,
        document: {
          supported_types: ["id_card", "passport"],
          allow_offline: "1",
          allow_online: "1",
        },
        address: {
          full_address: "48 Clare Crescent, Leatherhead, Surrey, KT22 7QZ",
          address_fuzzy_match: "1",
          supported_types: ["utility_bill", "passport", "bank_statement"],
        },
      };

      const token = btoa(`${SHUFTI_CLIENT_ID}:${SHUFTI_SECRET_KEY}`);
      const response = await fetch("https://api.shuftipro.com/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.event === "request.pending") {
        let verificationUrl = data.verification_url;
        createIframe(verificationUrl);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error starting KYC:", error);
    } finally {
      loadingKYC = false;
    }
  }

  function createIframe(src: string) {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.id = "shuftipro-iframe";
    iframe.name = "shuftipro-iframe";
    iframe.allow = "camera";
    iframe.src = src;
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.overflow = "hidden";
    iframe.style.border = "none";
    iframe.style.zIndex = "2147483647";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.dataset.removable = "true";

    document.body.appendChild(iframe);
  }
</script>

{#if isLoading || loadingKYC}
  <FullScreenSpinner />
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
          <p class="mb-1 text-xs">Username:</p>
          <h2 class="default-header mb-1 md:mb-2">
            {profile == null || profile.username == "" ? "Not Set" : profile.username}
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
              on:click={() => copyAndShowToast(principalId)}
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
                    on:click={() => copyAndShowToast(principalId)}
                  >
                    <span>{principalId}</span>
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
                
                {#if profile}
                  {#if kycComplete}
                    <p>KYC Verification Complete</p>
                  {:else}
                    <div class="flex items-center mt-2">
                      <div class="flex items-center text-xs mt-2">
                        <button
                        class="text-sm md:text-sm p-1 md:p-2 px-2 md:px-4 rounded fg-button button-hover"
                          on:click={beginKYC}
                        >
                          KYC Verification
                        </button>
                      </div>
                    </div>
                  {/if}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}