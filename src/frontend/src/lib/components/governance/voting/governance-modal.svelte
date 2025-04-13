<script lang="ts">
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import type { Snippet } from "svelte";

    interface Props {
      cancelModal: () => void;
      confirmProposal: () => void;
      children: Snippet;
      isLoading: boolean;
      isSubmitDisabled: boolean;
    }

    let { children, cancelModal, confirmProposal, isLoading, isSubmitDisabled }: Props = $props();
    
  
    function raiseProposal() {
      isSubmitDisabled = false;
    }
  
  </script>
  
  <div class="flex items-center justify-start w-full">
    {#if isLoading}
      <LocalSpinner />
    {:else}
        <div class="flex-col w-full mb-2 space-y-4">
          {@render children()}
          <div class="flex items-center space-x-4">
            <button
                class="px-4 py-2 brand-cancel-button min-w-[150px]"
                type="button"
                onclick={cancelModal}
            >
                Cancel
            </button>
            <button
                class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} px-4 py-2 min-w-[150px]`}
                onclick={raiseProposal}
            >
                Raise Proposal
            </button>
            </div>

            {#if !isSubmitDisabled}
            <div class="flex items-center">
                <p class="text-orange-400">
                Failed proposals will cost the proposer 10 $ICFC tokens.
                </p>
            </div>
            <div class="flex items-center">
                <button
                class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} px-4 py-2 w-full`}
                onclick={confirmProposal}
                disabled={isSubmitDisabled}
                >
                Confirm Submit Proposal
                </button>
            </div>
            {/if}

        </div>
    {/if}
  </div>