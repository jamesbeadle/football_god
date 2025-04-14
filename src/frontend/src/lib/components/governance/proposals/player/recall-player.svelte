<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { Player } from "../../../../../../../declarations/backend/backend.did";
  import type { RecallPlayer } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
  }

  let { visible, closeModal, selectedPlayer }: Props = $props();

  let isLoading = $state(true);
  let newValueMillions: number = $state(0);
  let isSubmitDisabled = $state(true);

  $effect(() => { isSubmitDisabled = newValueMillions == 0; });

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
    let dto: RecallPlayer = {
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

<Modal title={"Recall Player"} {visible} onClose={closeModal}>
  <GovernanceModal  {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Recall loan for {selectedPlayer.firstName} {selectedPlayer.lastName}</p>
    <FormComponent label="New Value (£ millions):">
      <input class="modal-input-box" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
    </FormComponent>
  </GovernanceModal>
</Modal>