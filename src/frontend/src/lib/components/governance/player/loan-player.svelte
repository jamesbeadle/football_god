<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import type { ClubDTO, FootballLeagueDTO, LoanPlayerDTO, PlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
  
  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedPlayer: PlayerDTO;
  
  let loanLeagueId: number = 0;
  let loanClubId: number = 0;
  let newValueMillions: number = 0;

  let date = "";

  let loanLeagues: FootballLeagueDTO[] = [];
  let loanClubs: ClubDTO[] = [];

  let isLoading = false;
  let showConfirm = false;
  let leaguesLoaded = false;

  $: isSubmitDisabled = loanLeagueId == 0 || loanClubId == 0 || date == "";

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      loanLeagues = await leagueStore.getLeagues();
      leaguesLoaded = true; 
    } catch (error) {
      console.error("Error mounting loan player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if(loanLeagueId > 0){
    getLoanClubs();
  };
  
  async function getLoanClubs() {
    loanClubs = await clubStore.getClubs(loanLeagueId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    
    let dto: LoanPlayerDTO = {
      leagueId: selectedPlayer.leagueId,
      loanEndDate: convertDateInputToUnixNano(date),
      playerId: selectedPlayer.id,
      loanClubId: loanClubId,
      loanLeagueId: loanLeagueId,
      newValueQuarterMillions: newValueMillions * 4
    };
    console.log("loaning player")
    console.log(dto)
    let result = await governanceStore.loanPlayer(dto);
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
    isLoading = false;
    resetForm();
    closeModal();
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    isLoading = false;
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-2 p-2">
    <div class="flex justify-between items-center mb-2">
      <h3 class="default-header">Loan Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2 flex space-y-2">

          <p class="">Loan {selectedPlayer.firstName} {selectedPlayer.lastName}</p>
        
          <p>Please select the league they are being loaned to:</p>

          <select
            class="brand-dropdown w-full"
            bind:value={loanLeagueId}
          >
            <option value={0}>Select League</option>
            {#each loanLeagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          {#if loanLeagueId > 0}

            <select
              class="brand-dropdown w-full"
              bind:value={loanClubId}
            >
              <option value={0}>Select Club</option>
              {#each loanClubs as club}
                <option value={club.id}>{club.friendlyName}</option>
              {/each}
            </select>

            {#if loanClubId > 0}
              <div class="flex flex-row w-full items-center">
                <p class="w-1/2">Loan End Date:</p>
                <input class="w-1/2 brand-input" type="date" bind:value={date} />
              </div>

              <div class="flex flex-row w-full items-center">
                <p class="w-1/2">New Value (£ millions):</p>
                <input class="w-1/2 brand-input" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
              </div>

            {/if}
          {/if}

          <div class="items-center flex flex-row space-x-4 w-full">
            <button
              class="brand-cancel-button w-1/2"
              type="button"
              on:click={cancelModal}
            >
              Cancel
            </button>
            <button
              class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} w-1/2`}
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
</Modal>





