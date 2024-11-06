<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { Modal } from "@dfinity/gix-components";
  import LocalSpinner from "$lib/components/local-spinner.svelte";
  import { toastsError } from "$lib/stores/toasts-store";
  import type { ClubDTO, FootballLeagueDTO, RemoveClubDTO } from "../../../../../../declarations/football_god_backend/football_god_backend.did";
  import { adminStore } from "$lib/stores/admin-store";
  import { leagueStore } from "$lib/stores/league-store";

  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedLeagueId: number = 0;
  export let selectedClubId: number = 0;
  
  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  
  let isLoading = false;
  let showConfirm = false;
  let leaguesLoaded = false;

  $: isSubmitDisabled =
    selectedLeagueId <= 0 ||
    selectedClubId <= 0;


  onMount(async () => {
    try {
      isLoading = true;
      leagues = await leagueStore.getLeagues();
      leaguesLoaded = true; 
      
      if (selectedLeagueId > 0) {
        await getClubs();
      }
    } catch (error) {
      toastsError({
        msg: { text: "Error mounting create player modal." },
        err: error,
      });
      console.error("Error mounting create player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if (leaguesLoaded && selectedLeagueId > 0) {
    getClubs();
  }

  async function getClubs() {
    clubs = await clubStore.getClubs(selectedLeagueId);
  }
  
  function raiseProposal() {
    showConfirm = true;
  }

  async function confirmProposal() {
    isLoading = true;
    
    let dto: RemoveClubDTO = {
      leagueId: selectedLeagueId,
      clubId: selectedClubId
    };
    console.log(dto)
    await adminStore.removeClub(dto);

    closeModal();
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    selectedLeagueId = 0;
    selectedClubId = 0;
    clubs = [];
    isLoading = false;
  }
</script>

<Modal {visible} on:nnsClose={cancelModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Remove Club</h3>
      <button class="times-button" on:click={cancelModal}>&times;</button>
    </div>

    <div class="flex justify-start items-center w-full">
      {#if isLoading}
        <LocalSpinner />
      {:else}
        <div class="w-full flex-col space-y-4 mb-2">
          <p>Select the club's league:</p>

          <select
            class="p-2 brand-dropdown min-w-[100px]"
            bind:value={selectedLeagueId}
          >
            <option value={0}>Select League</option>
            {#each leagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          {#if selectedLeagueId > 0}
            <p>Select the club:</p>

            <select
              class="p-2 brand-dropdown min-w-[100px]"
              bind:value={selectedClubId}
            >
              <option value={0}>Select Club</option>
              {#each clubs as club}
                <option value={club.id}>{club.friendlyName}</option>
              {/each}
            </select>
          {/if}

          <div class="border-b border-gray-200" />

          <div class="items-center flex space-x-4">
            <button
              class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]"
              type="button"
              on:click={cancelModal}
            >
              Cancel
            </button>
            <button
              class={`${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                          px-4 py-2 default-button min-w-[150px]`}
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
                class={`${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                              px-4 py-2 default-button w-full`}
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





