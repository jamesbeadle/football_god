<script lang="ts">
  import { onMount } from "svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { convertDateInputToUnixNano, isError } from "$lib/utils/helpers";
  import type { Player } from "../../../../../../../declarations/backend/backend.did";
  import type { SetPlayerInjury } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
  }

  let { visible, closeModal, selectedPlayer }: Props = $props();

  let description = $state("");
  let injuryEndDate = $state("");
  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(true);
  $effect(() => { injuryEndDate == "" || description.length == 0});


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
      let dto: SetPlayerInjury = {
        leagueId: selectedPlayer.leagueId,
        playerId: selectedPlayer.id,
        description,
        expectedEndDate: convertDateInputToUnixNano(injuryEndDate)
      };
      submitting = true;

      let result = await governanceStore.setPlayerInjury(dto);
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
    description = "";
    injuryEndDate = "";
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={"Set Player Injury"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Enter the injury description:">
      <input
        type="text"
        class="brand-input"
        placeholder="Injury Description"
        bind:value={description}
      />
    </FormComponent>

    <FormComponent label="Enter the expected return date of the player:">
        <input
        type="date"
        bind:value={injuryEndDate}
        class="brand-dropdown"
      />
    </FormComponent>
  </GovernanceModal>
</Modal>