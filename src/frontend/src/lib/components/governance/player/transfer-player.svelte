<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, ClubId, FootballLeagueDTO, PlayerDTO, TransferPlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
  
  export let visible: boolean;
  export let closeModal: () => void;

  export let player: PlayerDTO;
  let playerClub: ClubDTO;

  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  
  let transferToLeagueId: number = 0;
  let transferToClubId: number = 0;
  
  let shirtNumber: number = 0;
  let newValueMillions: number = 0;
  
  let isLoading = false;
  let showConfirm = false;

  $: isSubmitDisabled = transferToLeagueId <= 0 || transferToClubId <= 0 || newValueMillions == 0

  $: if(transferToLeagueId && transferToLeagueId > 0) {
    getLeagueClubs();
  };
  
  $: if (isSubmitDisabled && showConfirm) {
    showConfirm = false;
  }

  onMount(async () => {
    try {
      let playerLeagueClubs = await clubStore.getClubs(player.leagueId);
      let playerClubResult = playerLeagueClubs.find(x => x.id == player.clubId);
      if(playerClubResult){
        playerClub = playerClubResult;
      }
      leagues = await leagueStore.getLeagues();
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function getLeagueClubs() {
    clubs = await clubStore.getClubs(transferToLeagueId);
  }

  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: TransferPlayerDTO = {
      leagueId: player.leagueId,
      clubId: player.clubId,
      newLeagueId: transferToLeagueId,
      playerId: player.id,
      newClubId: transferToClubId,
      newShirtNumber: shirtNumber,
      newValueQuarterMillions: newValueMillions * 4
    };
    await governanceStore.transferPlayer(dto);
    isLoading = false;
    resetForm();
    closeModal();
  }

  function resetForm() {
    leagues = [];
    clubs = [];
    transferToLeagueId = 0;
    transferToClubId = 0;
    shirtNumber = 0;
    newValueMillions = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Transfer Player</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">

        <p>
          Transfer {player.firstName} {player.lastName}
        </p>

        <p>
          Currnet Club: {playerClub.name}
        </p>

        <p>
          Current Value: £{(player.valueQuarterMillions / 4).toFixed(2)}
        </p>

        <p>Please select players new league:</p>

        <select class="p-2 brand-dropdown min-w-[100px]" bind:value={transferToLeagueId}>
          <option value={0}>Select League</option>
            {#each leagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          {#if transferToLeagueId > 0}
            <select class="p-2 brand-dropdown min-w-[100px]" bind:value={transferToClubId}>
              <option value={0}>Select Club</option>
              {#each clubs as club}
                <option value={club.id}>{club.friendlyName}</option>
              {/each}
            </select>

            {#if transferToClubId > 0}
              <p class="py-2">Shirt Number:</p>

              <input
                type="number"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Shirt Number"
                min="1"
                max="99"
                step="1"
                bind:value={shirtNumber}
              />
            {/if}
          {/if}

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
    </div>

    {#if isLoading}
      <LocalSpinner />
    {/if}
  </div>
</Modal>