<script lang="ts">
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player-store";
  import type { LoanedPlayerDTO, RecallPlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
  export let visible: boolean;
  export let closeModal: () => void;

  export let selectedPlayer: LoanedPlayerDTO;


  let isLoading = true;
  let newValueMillions: number = 0;
  $: isSubmitDisabled = newValueMillions == 0;

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function confirmProposal() {
    isLoading = true;
    let dto: RecallPlayerDTO = {
      leagueId: selectedPlayer.leagueId,
      playerId: selectedPlayer.id,
      newValueQuarterMillions: newValueMillions * 4
    };
    //await playerStore.recallLoan(selectedPlayer.parentLeagueId, dto);
    let result = await governanceStore.recallPlayer(dto);
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
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

{#if visible}
  <Modal onClose={closeModal}>
    <GovernanceModal title={"Recall Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
      <p>Recall loan for {selectedPlayer.firstName} {selectedPlayer.lastName}</p>
      <FormComponent label="New Value (£ millions):">
        <input class="modal-input-box" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
      </FormComponent>
    </GovernanceModal>
  </Modal>
{/if}