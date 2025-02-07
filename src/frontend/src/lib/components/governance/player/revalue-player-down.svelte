<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/shared/modal.svelte";
  import type { ClubDTO, PlayerDTO, RevaluePlayerDownDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import GovernanceModal from "../governance-modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let player: PlayerDTO;
  export let club: ClubDTO;

  let isLoading = false;

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
    isLoading = true;
    var dto: RevaluePlayerDownDTO = {
        leagueId: player.leagueId,
        playerId: player.id,
      };
    let result = await governanceStore.revaluePlayerDown(dto);
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

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Reavlue Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Raise proposal to decrease the value of {player.firstName} {player.lastName} ({club.friendlyName}) by £0.25?</p>
  </GovernanceModal>
</Modal>