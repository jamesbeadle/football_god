<script lang="ts">
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import Modal from "$lib/components/shared/global/modal.svelte";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { Club, League, LeagueId } from "../../../../../../../declarations/backend/backend.did";
  import type { PromoteClub } from "../../../../../../../declarations/data_canister/data_canister.did";
  import GovernanceModal from "../../voting/governance-modal.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedLeagueId: number;
    selectedClub: Club
  }

  let { visible, closeModal, selectedLeagueId, selectedClub }: Props = $props();
    
  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(true);

  let promotionLeagues: League[] = []

  let newLeagueId: LeagueId = $state(0);

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      let dto: PromoteClub = {
        clubId: selectedClub.id,
        toLeagueId: newLeagueId,
        leagueId: selectedLeagueId,
      };
      submitting = true;

      let result = await governanceStore.promoteClub(dto);
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
    newLeagueId = 0;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal title={"Promote New Club"} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="New league:">
      <select
        class="brand-dropdown"
        bind:value={newLeagueId}
      >
        <option value={0}>Select League</option>
        {#each promotionLeagues as league}
          <option value={league.id}>{league.name}</option>
        {/each}
      </select>
    </FormComponent>
  </GovernanceModal>
</Modal>