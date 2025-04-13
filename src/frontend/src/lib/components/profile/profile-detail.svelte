<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { userStore } from "$lib/stores/user-store";
  
  import WithdrawIcfcModal from "./withdraw-icfc-modal.svelte";
  import IcfcCoinIcon from "$lib/icons/ICFCCoinIcon.svelte";
  import CopyPrincipal from "./copy-principal.svelte";
  
  let isLoading = $state(true);

  let icfcBalance = 0n;
  let icfcBalanceFormatted = $state("0.0000"); 
  let dots = writable('.');
  let dot_interval: ReturnType<typeof setInterval>;

  let showICFCModal = $state(false);

  onMount(async () => {
    try {
      startDotAnimation();
      await fetchBalances();
    } catch (error) {
      console.error("Error fetching profile detail:", error);
      isLoading = false;
    }
  });

  function startDotAnimation(){
    let count = 1;
    dot_interval = setInterval(() => {
      count = (count % 3) + 1;
      dots.set('.'.repeat(count));
    }, 500);
  }
  
  function loadWithdrawICFCModal(){
    showICFCModal = true;
  };

  async function closeWithdrawICFCModal(){
    showICFCModal = false;
    startDotAnimation();
    await fetchBalances();
  };

  async function fetchBalances() {
    try {
      let icfcBalance = await userStore.getICFCBalance();
      icfcBalanceFormatted = (Number(icfcBalance) / 100_000_000).toFixed(4);
    } catch (error) {
      console.error("Error fetching profile detail:", error);
    } finally {
      clearInterval(dot_interval);
      isLoading = false;
    }
  }

</script>

<div class="panel-content">
  <CopyPrincipal />
  {#if isLoading}
    <div class="dot-animation min-w-[20px]">{$dots}</div>
  {:else}
  <p class="stacked-row items-center">
    <IcfcCoinIcon className="w-6 mr-2" />
    {icfcBalanceFormatted} ICFC
  </p>
  <div class="flex items-center text-xs mt-2">
    <button class="brand-button" onclick={loadWithdrawICFCModal}>
      Withdraw
    </button>
  </div>
    {/if}
</div>

{#if showICFCModal}
  <WithdrawIcfcModal
    visible={showICFCModal}
    closeModal={closeWithdrawICFCModal}
    cancelModal={closeWithdrawICFCModal}
    icfcBalance={icfcBalance}
    icfcBalanceFormatted={icfcBalanceFormatted}
  />
{/if}