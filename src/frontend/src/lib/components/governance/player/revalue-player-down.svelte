<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import GovernanceModal from "../governance-modal.svelte";
  import { toasts } from "$lib/stores/toasts-store";
    import type { Club, Player } from "../../../../../../declarations/backend/backend.did";
    import type { RevaluePlayerDown } from "../../../../../../declarations/data_canister/data_canister.did";

  export let visible: boolean;
  export let closeModal: () => void;
  export let player: Player;
  export let club: Club;

  let isLoading = false;
  let submitting = false;
  let submitted = false;

  $: isSubmitDisabled = false;

  onMount(async () => {
    try {
      isLoading = false;
    } catch (error) {
      console.error("Error mounting revalue down modal.", error);
    } finally {
      isLoading = false;
    }
  });

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      var dto: RevaluePlayerDown = {
        leagueId: player.leagueId,
        playerId: player.id,
      };
      submitting = true;

      let result = await governanceStore.revaluePlayerDown(dto);
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

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Reavlue Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Raise proposal to decrease the value of {player.firstName} {player.lastName} ({club.friendlyName}) by £0.25?</p>
  </GovernanceModal>
</Modal>