<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import type { ClubDTO, FootballLeagueDTO, LoanPlayerDTO, PlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
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
  let submitting = false;
  let submitted = false;

  $: isSubmitDisabled = loanLeagueId == 0 || loanClubId == 0 || date == "";

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      loanLeagues = await leagueStore.getLeagues();
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

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
    
      let dto: LoanPlayerDTO = {
        leagueId: selectedPlayer.leagueId,
        loanEndDate: convertDateInputToUnixNano(date),
        playerId: selectedPlayer.id,
        loanClubId: loanClubId,
        loanLeagueId: loanLeagueId,
        newValueQuarterMillions: newValueMillions * 4
      };
      submitting = true;

      let result = await governanceStore.loanPlayer(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }

      submitted = true;
      submitting = false;
    } catch (error) {
      console.error("Error raising proposal: ", error);
    } finally {
      isLoading = false;
      visible = false;
      resetForm();
      closeModal();
    }
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }

  function resetForm() {
    newValueMillions = 0;
    isLoading = false;
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Loan Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>

    <p class="my-2">Loan {selectedPlayer.firstName} {selectedPlayer.lastName}</p>

    <FormComponent label="Select loan league:">
      <select
        class="brand-dropdown"
        bind:value={loanLeagueId}
      >
        <option value={0}>Select League</option>
        {#each loanLeagues as league}
          <option value={league.id}>{league.name}</option>
        {/each}
      </select>

    </FormComponent>
        
    {#if loanLeagueId > 0}
      <FormComponent label="Select loan club:">
        <select
          class="brand-dropdown"
          bind:value={loanClubId}
        >
          <option value={0}>Select Club</option>
          {#each loanClubs as club}
            <option value={club.id}>{club.friendlyName}</option>
          {/each}
        </select>
      </FormComponent>

      {#if loanClubId > 0}
        <FormComponent label="Loan End Date:">
          <input class="brand-input" type="date" bind:value={date} />
        </FormComponent>

        <FormComponent label="New Value (£ millions):">
          <input class="brand-input" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
        </FormComponent>
      {/if}
    {/if}
  </GovernanceModal>
</Modal>





