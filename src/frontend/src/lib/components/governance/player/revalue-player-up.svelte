<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { ClubDTO, PlayerDTO, RevaluePlayerUpDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
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
      console.error("Error mounting revalue up modal.", error);
    } finally {
      isLoading = false;
    }
  });

  async function confirmProposal() {
    isLoading = true;
    var dto: RevaluePlayerUpDTO = {
        leagueId: player.leagueId,
        playerId: player.id,
      };
    let result = await governanceStore.revaluePlayerUp(dto);
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
  <GovernanceModal title={"Revalue Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Raise proposal to decrease the value of {player.firstName} {player.lastName} ({club.friendlyName}) by £0.25?</p>
  </GovernanceModal>
</Modal>