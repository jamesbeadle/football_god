<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, FootballLeagueDTO, PlayerDTO, TransferPlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  
  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedPlayer: PlayerDTO;
  
  let transferLeagueId: number = 0;
  let transferClubId: number = 0;
  let newValueMillions: number = 0;
  let shirtNumber: number = 0;

  let transferLeagues: FootballLeagueDTO[] = [];
  let transferClubs: ClubDTO[] = [];
  
  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled = transferLeagueId == 0 || transferClubId == 0 || newValueMillions == 0;

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      transferLeagues = await leagueStore.getLeagues();
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if(transferLeagueId > 0){
    getTransferClubs();
  };

  async function getTransferClubs() {
    transferClubs = await clubStore.getClubs(transferLeagueId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: TransferPlayerDTO = {
      leagueId: selectedPlayer.leagueId,
      clubId: selectedPlayer.clubId,
      newLeagueId: transferLeagueId,
      playerId: selectedPlayer.id,
      newClubId: transferClubId,
      newShirtNumber: shirtNumber,
      newValueQuarterMillions: newValueMillions * 4
    };

    let result = await governanceStore.transferPlayer(dto);
    if (isError(result)) {
      isLoading = false;
      console.error("Error submitting proposal");
      return;
    }
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    shirtNumber = 0;
    newValueMillions = 0;
    isLoading = false;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>
<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-2 p-2">
    <div class="flex justify-between items-center mb-2">
      <h3 class="default-header">Transfer Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2 flex space-y-2">

          <p class="">Transfer {selectedPlayer.firstName} {selectedPlayer.lastName}</p>
        
          <p>Please select the league they are being transferred to:</p>

          <select
            class="brand-dropdown w-full"
            bind:value={transferLeagueId}
          >
            <option value={0}>Select League</option>
            {#each transferLeagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          {#if transferLeagueId > 0}

            <select
              class="brand-dropdown w-full"
              bind:value={transferClubId}
            >
              <option value={0}>Select Club</option>
              {#each transferClubs as club}
                <option value={club.id}>{club.friendlyName}</option>
              {/each}
            </select>

            {#if transferClubId > 0}

              <div class="flex flex-row w-full items-center">
                <p class="w-1/2">New Value (£ millions):</p>
                <input class="w-1/2 brand-input" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
              </div>

              <div class="flex flex-row w-full items-center">
                <p class="w-1/2">New Shirt Number:</p>
                <input
                  type="number"
                  class="w-1/2 brand-input"
                  placeholder="Shirt Number"
                  min="1"
                  max="99"
                  step="1"
                  bind:value={shirtNumber}
                />
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