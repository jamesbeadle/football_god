<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import type { PlayerDTO, RetirePlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedPlayer: PlayerDTO;

  let retirementDate: string = "";
  let isLoading = false;
  let submitting = false;
  let submitted = false;

  $: isSubmitDisabled = selectedPlayer == null || retirementDate == "";

  onMount(async () => {
    try {
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
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
      let dto: RetirePlayerDTO = {
        playerId: selectedPlayer.id,
        retirementDate: convertDateInputToUnixNano(retirementDate),
        leagueId: selectedPlayer.leagueId
      };
      submitting = true;

      let result = await governanceStore.retirePlayer(dto);
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

  function resetForm() {
    retirementDate = "";
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Retire Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
   <FormComponent label="Retirement Date:">
    <input
      type="date"
      bind:value={retirementDate}
      class="brand-dropdown"
    />
   </FormComponent>
  </GovernanceModal>
</Modal>