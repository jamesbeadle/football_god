<script lang="ts">
  import { userStore } from "$lib/stores/user-store";
  import Modal from "../shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let cancelModal: () => void;
  export let withdrawalAddress: string = "";
  export let withdrawalInputAmount: string = "";
  export let fplBalance: bigint;
  export let fplBalanceFormatted: string;

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
    const maxAmount = Number(fplBalance) / 100_000_000;
    withdrawalInputAmount = maxAmount.toFixed(4);
  }

  $: isSubmitDisabled = !isPrincipalValid(withdrawalAddress) || !isWithdrawAmountValid(withdrawalInputAmount, fplBalance);

  $: errorMessage = (!isAmountValid(withdrawalInputAmount) || !isWithdrawAmountValid(withdrawalInputAmount, fplBalance)) && withdrawalInputAmount
    ? "Withdrawal amount greater than account balance."
    : "";

  async function withdrawFPL() {
    try {
      const amountInE8s = convertToE8s(withdrawalInputAmount);
      await userStore.withdrawFPL(withdrawalAddress, amountInE8s);
      await closeModal();
    } catch (error) {
      console.error("Error withdrawing FPL:", error);
      cancelModal();
    } finally {
    }
  }
</script>

{#if visible}
  <Modal onClose={closeModal}>
    <div class="p-4 mx-4">
      <div class="flex items-center justify-between my-2">
        <h3 class="default-header">Withdraw FPL</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
      <form on:submit|preventDefault={withdrawFPL}>
        <p>FPL Balance: {fplBalanceFormatted}</p>
        <div class="mt-4">
          <input
            type="text"
            class="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Withdrawal Address"
            bind:value={withdrawalAddress}
          />
        </div>
        <div class="flex items-center mt-4">
          <input
            type="text"
            class="w-full px-4 py-2 mr-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Withdrawal Amount"
            bind:value={withdrawalInputAmount}
          />
          <button
            type="button"
            class="p-1 px-2 text-sm rounded md:text-sm md:p-2 md:px-4 brand-button"
            on:click={setMaxWithdrawAmount}
          >
            Max
          </button>
        </div>
        {#if errorMessage}
          <div class="mt-2 text-red-600">{errorMessage}</div>
        {/if}
        <div class="flex flex-row items-center py-3 space-x-4">
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
{/if}
