<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { toasts } from "$lib/stores/toasts-store";
  import { isError } from "$lib/utils/helpers";
  import type { Club, Player } from "../../../../../../../declarations/backend/backend.did";
  import type { RevaluePlayerUp } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
    club: Club;
  }

  let { visible, closeModal, selectedPlayer, club }: Props = $props();

  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(false);

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      var dto: RevaluePlayerUp = {
        leagueId: selectedPlayer.leagueId,
        playerId: selectedPlayer.id,
      };
      submitting = true;

      let result = await governanceStore.revaluePlayerUp(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }

      submitted = true;
      submitting = false;
      toasts.addToast({
        message: "Revalue player proposal created successfully",
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

  function resetForm() {
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={"Revalue Player"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Raise proposal to increase the value of {selectedPlayer.firstName} {selectedPlayer.lastName} ({club.friendlyName}) by £0.25?</p>
  </GovernanceModal>
</Modal>