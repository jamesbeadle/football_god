<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import { toasts } from "$lib/stores/toasts-store";
  import type { Club, League, Player } from "../../../../../../../declarations/backend/backend.did";
  import type { LoanPlayer } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
  }

  let { visible, closeModal, selectedPlayer }: Props = $props();
  
  let loanLeagueId: number = $state(0);
  let loanClubId: number = $state(0);
  let newValueMillions: number = $state(0);
  let date = $state("");
  let loanLeagues: League[] = $state([]);
  let loanClubs: Club[] = $state([]);
  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(true);

  $effect(() => {
    isSubmitDisabled = loanLeagueId == 0 || loanClubId == 0 || date == "";
  });  

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error loading leagues")
      loanLeagues  = leaguesResult.leagues;
    
    } catch (error) {
      console.error("Error mounting loan player modal.", error);
    } finally {
      isLoading = false;
    }
  });

  $effect(() => {
    if(loanLeagueId > 0){
      getLoanClubs();
    };
  });
  
  async function getLoanClubs() {
    let clubsResult = await clubStore.getClubs(loanLeagueId);
      if(!clubsResult) throw new Error("Error loading clubs")
      loanClubs  = clubsResult.clubs;
  }

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
    
      let dto: LoanPlayer = {
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
      toasts.addToast({
        message: "Loan player proposal submitted successfully",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Error raising proposal: ", error);
      toasts.addToast({
        message: "Error submitting proposal",
        type: "error",
      });
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

<Modal title={"Loan Player " + selectedPlayer.firstName + " " + selectedPlayer.lastName} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Select loan league:">
      <select class="brand-dropdown" bind:value={loanLeagueId}>
        {#each loanLeagues.map(league => ({ id: league.id, label: league.name })) as league}
          <option value={league.id}>{league.label}</option>
        {/each}
      </select>
    </FormComponent>
    
    {#if loanLeagueId > 0}
        <div class="z-10 space-y-3">
          <FormComponent label="Select loan club:">
            <select class="brand-dropdown" bind:value={loanClubId}>
              {#each loanClubs.map(club => ({ id: club.id, label: club.friendlyName })) as club}
                <option value={club.id}>{club.label}</option>
              {/each}
            </select>
          </FormComponent>

          {#if loanClubId > 0}
            <FormComponent label="Loan End Date:">
              <input class="modal-input-box" type="date" bind:value={date} />
            </FormComponent>

            <FormComponent label="New Value (£ millions):">
              <input class="modal-input-box" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
            </FormComponent>
          {/if}
        </div>
    {/if}
  </GovernanceModal>
</Modal>




