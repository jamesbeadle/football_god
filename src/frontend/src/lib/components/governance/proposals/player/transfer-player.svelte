<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import DropdownSelect from "$lib/components/shared/dropdown-select.svelte";
  import { toasts } from "$lib/stores/toasts-store";
    import type { Club, League, Player } from "../../../../../../../declarations/backend/backend.did";
    import type { TransferPlayer } from "../../../../../../../declarations/data_canister/data_canister.did";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedPlayer: Player;
  
  let transferLeagueId: number = 0;
  let transferClubId: number = 0;
  let newValueMillions: number = 0;
  let shirtNumber: number = 0;

  let transferLeagues: League[] = [];
  let transferClubs: Club[] = [];
  
  let isLoading = false;
  let submitting = false;
  let submitted = false;

  $: isSubmitDisabled = transferLeagueId == 0 || transferClubId == 0 || newValueMillions == 0;

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error loading leagues")
      transferLeagues  = leaguesResult.leagues;
    } catch (error) {
      console.error("Error syncing proposal data.", error);
    } finally {
      isLoading = false;
    }
  });

  $: if(transferLeagueId > 0){
    getTransferClubs();
  };

  async function getTransferClubs() {
    let clubsResult = await clubStore.getClubs(transferLeagueId);
      if(!clubsResult) throw new Error("Error loading clubs")
      transferClubs = clubsResult.clubs;
  }

  async function confirmProposal() {
    
    if(submitted || submitting){
      return;
    }

    try {
      isLoading = true;
      let dto: TransferPlayer = {
        leagueId: selectedPlayer.leagueId,
        clubId: selectedPlayer.clubId,
        newLeagueId: transferLeagueId,
        playerId: selectedPlayer.id,
        newClubId: transferClubId,
        newShirtNumber: shirtNumber,
        newValueQuarterMillions: newValueMillions * 4
      };
      
      submitting = true;
      let result = await governanceStore.transferPlayer(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }
      else {
        toasts.addToast({
          message: "Transfer player proposal created successfully",
          type: "success",
          duration: 3000
        });
      }
      submitted = true;
      submitting = false;
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
    }
  }

  function resetForm() {
    shirtNumber = 0;
    newValueMillions = 0;
    isLoading = false;
  }

  function cancelModal() {
    closeModal();
    resetForm();
  }
</script>
<Modal title={"Transfer " + selectedPlayer.firstName + " " + selectedPlayer.lastName} {visible} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <FormComponent label="Transfer to league:">
      <DropdownSelect
        options={transferLeagues.map((league: League) => ({ id: league.id, label: league.name }))}
        value={transferLeagueId}
        onChange={(value: string | number) => {
          transferLeagueId = Number(value);
        }}
        scrollOnOpen={true}
      />
    </FormComponent>
        
    {#if transferLeagueId > 0}
      <FormComponent label="Transfer to club:">
        <DropdownSelect
          options={transferClubs.map((club: Club) => ({ id: club.id, label: club.friendlyName }))}
          value={transferClubId}
          onChange={(value: string | number) => {
            transferClubId = Number(value);
          }}
          scrollOnOpen={true}
        />
      </FormComponent>

      {#if transferClubId > 0}
        <FormComponent label="New Value (£ millions):">
          <input class="modal-input-box z-100" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />    
        </FormComponent>

        <FormComponent label="New Shirt Number:">
          <input
            type="number"
            class="modal-input-box"
            placeholder="Shirt Number"
            min="1"
            max="99"
            step="1"
            bind:value={shirtNumber}
          />
        </FormComponent>
      {/if}
    {/if}
  </GovernanceModal>
</Modal>