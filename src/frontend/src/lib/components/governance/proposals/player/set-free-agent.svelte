<script lang="ts">
  import { onMount } from "svelte";
  import type { Player } from "../../../../../../../declarations/backend/backend.did";
  import type { SetFreeAgent } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  
  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedPlayer: Player;
  }

  let { visible, closeModal, selectedPlayer }: Props = $props();
  
  let isLoading = $state(false);
  let newValueMillions: number = $state(0);

  let isSubmitDisabled = $state(true);
  $effect(() => { selectedPlayer == null || newValueMillions == 0});


  onMount(async () => {
    try {
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      isLoading = false;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  async function confirmProposal() {
    isLoading = true;
    let dto: SetFreeAgent = {
      leagueId: selectedPlayer.leagueId,
      playerId: selectedPlayer.id,
      newValueQuarterMillions: newValueMillions * 4
    };
    await governanceStore.setFreeAgent(dto);
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

<Modal title={"Set Free Agent"} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}><p>Select the player's league:</p>
    <p>Set {selectedPlayer.firstName} {selectedPlayer.lastName} as a free agent:</p>
    <FormComponent label="New Value (£ millions):">
      <div class="flex flex-row w-full items-center">
        <input class="brand-input" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />
      </div>
    </FormComponent>
  </GovernanceModal>
</Modal>