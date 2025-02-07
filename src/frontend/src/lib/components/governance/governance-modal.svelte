<script lang="ts">
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    export let cancelModal: () => void;
    export let confirmProposal: () => void;
    export let isLoading: boolean;
    export let isSubmitDisabled: boolean;
    export let title: string;
    let showConfirm = false;
  
    function raiseProposal() {
      showConfirm = true;
    }

    $: if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  
  </script>
  
    <div class="m-2">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">{title}</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
  
      <div class="flex justify-start items-center w-full">
        {#if isLoading}
          <LocalSpinner />
        {:else}
            <div class="w-full flex-col space-y-4 mb-2">
                <slot></slot>
                <div class="items-center flex space-x-4">
                <button
                    class="px-4 py-2 brand-cancel-button min-w-[150px]"
                    type="button"
                    on:click={cancelModal}
                >
                    Cancel
                </button>
                <button
                    class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                                px-4 py-2 min-w-[150px]`}
                    on:click={raiseProposal}
                    disabled={isSubmitDisabled}
                >
                    Raise Proposal
                </button>
                </div>
    
                {#if showConfirm}
                <div class="items-center flex">
                    <p class="text-orange-400">
                    Failed proposals will cost the proposer 10 $FPL tokens.
                    </p>
                </div>
                <div class="items-center flex">
                    <button
                    class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                                    px-4 py-2 w-full`}
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
    </div>
  
  
  
  
  
  