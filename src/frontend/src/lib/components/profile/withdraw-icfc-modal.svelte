<script lang="ts">
  import { userStore } from "$lib/stores/user-store";
    import Modal from "../shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let cancelModal: () => void;
  export let withdrawalAddress: string = "";
  export let withdrawalInputAmount: string = "";
  export let icfcBalance: bigint;
  export let icfcBalanceFormatted: string;

  let errorMessage: string = "";

  function isPrincipalValid(principalId: string): boolean {
    if (!principalId) {
      return false;
    }
    const regex = /^([a-z2-7]{5}-){10}[a-z2-7]{3}$/i;
    return regex.test(principalId);
  }

  function isAmountValid(amount: string): boolean {
    if (!amount) {
      return false;
    }
    const regex = /^\d+(\.\d{1,4})?$/;
    return regex.test(amount);
  }

  function convertToE8s(amount: string): bigint {
    const [whole, fraction = ""] = amount.split(".");
    const fractionPadded = (fraction + "00000000").substring(0, 8);
    return (BigInt(whole) * 100_000_000n) + BigInt(fractionPadded);
  }

  function isWithdrawAmountValid(amount: string, balance: bigint): boolean {
    if (!isAmountValid(amount)) {
      return false;
    }
    const amountInE8s = convertToE8s(amount);
    return amountInE8s <= balance;
  }

  function setMaxWithdrawAmount() {
    const maxAmount = Number(icfcBalance) / 100_000_000;
    withdrawalInputAmount = maxAmount.toFixed(4);
  }

  $: isSubmitDisabled = !isPrincipalValid(withdrawalAddress) || !isWithdrawAmountValid(withdrawalInputAmount, icfcBalance);

  $: errorMessage = (!isAmountValid(withdrawalInputAmount) || !isWithdrawAmountValid(withdrawalInputAmount, icfcBalance)) && withdrawalInputAmount
    ? "Withdrawal amount greater than account balance."
    : "";

  async function withdrawICFC() {
    try {
      const amountInE8s = convertToE8s(withdrawalInputAmount);
      await userStore.withdrawICFC(withdrawalAddress, amountInE8s);
      await closeModal();
    } catch (error) {
      console.error("Error withdrawing ICFC:", error);
      cancelModal();
    } finally {
    }
  }
</script>

<Modal title="Withdraw ICFC" {visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="page-title">Withdraw ICFC</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>
    <form on:submit|preventDefault={withdrawICFC}>
      <p>ICFC Balance: {icfcBalanceFormatted}</p>
      <div class="mt-4">
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Withdrawal Address"
          bind:value={withdrawalAddress}
        />
      </div>
      <div class="mt-4 flex items-center">
        <input
          type="text"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mr-2"
          placeholder="Withdrawal Amount"
          bind:value={withdrawalInputAmount}
        />
        <button
          type="button"
          class="text-sm md:text-sm p-1 md:p-2 px-2 md:px-4 rounded brand-button"
          on:click={setMaxWithdrawAmount}
        >
          Max
        </button>
      </div>
      {#if errorMessage}
        <div class="mt-2 text-red-600">{errorMessage}</div>
      {/if}
      <div class="items-center py-3 flex space-x-4 flex-row">
        <button
          class="px-4 py-2 brand-cancel-button"
          type="button"
          on:click={cancelModal}
        >
          Cancel
        </button>
        <button
          class={`px-4 py-2 ${
            isSubmitDisabled ? "brand-button-disabled" : "brand-button"
          }`}
          type="submit"
          disabled={isSubmitDisabled}
        >
          Withdraw
        </button>
      </div>
    </form>
  </div>
</Modal>
