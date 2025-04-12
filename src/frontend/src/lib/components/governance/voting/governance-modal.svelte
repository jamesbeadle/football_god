<script lang="ts">
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";

    export let cancelModal: () => void;
    export let confirmProposal: () => void;
    export let isLoading: boolean;
    export let isSubmitDisabled: boolean;
    
    let showConfirm = false;
  
    function raiseProposal() {
      showConfirm = true;
    }

    $: if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  
  </script>
  
  <div class="flex items-center justify-start w-full">
    {#if isLoading}
      <LocalSpinner />
    {:else}
        <div class="flex-col w-full mb-2 space-y-4">
            <slot></slot>
            <div class="flex items-center space-x-4">
            <button
                class="px-4 py-2 brand-cancel-button min-w-[150px]"
                type="button"
                on:click={cancelModal}
            >
                Cancel
            </button>
            <button
                class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} px-4 py-2 min-w-[150px]`}
                on:click={raiseProposal}
                disabled={isSubmitDisabled}
            >
                Raise Proposal
            </button>
            </div>

            {#if showConfirm}
            <div class="flex items-center">
                <p class="text-orange-400">
                Failed proposals will cost the proposer 10 $ICFC tokens.
                </p>
            </div>
            <div class="flex items-center">
                <button
                class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} px-4 py-2 w-full`}
                on:click={confirmProposal}
                disabled={isSubmitDisabled}
                >
                Confirm Submit Proposal
                </button>
            </div>
            {/if}

        </div>
    {/if}
  </div>