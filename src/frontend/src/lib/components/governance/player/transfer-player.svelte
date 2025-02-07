<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { ClubDTO, FootballLeagueDTO, PlayerDTO, TransferPlayerDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedPlayer: PlayerDTO;
  
  let transferLeagueId: number = 0;
  let transferClubId: number = 0;
  let newValueMillions: number = 0;
  let shirtNumber: number = 0;

  let transferLeagues: FootballLeagueDTO[] = [];
  let transferClubs: ClubDTO[] = [];
  
  let isLoading = false;

  $: isSubmitDisabled = transferLeagueId == 0 || transferClubId == 0 || newValueMillions == 0;

  onMount(async () => {
    try {
      isLoading = true;
      newValueMillions = selectedPlayer.valueQuarterMillions / 4;
      transferLeagues = await leagueStore.getLeagues();
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
    transferClubs = await clubStore.getClubs(transferLeagueId);
  }

  async function confirmProposal() {
    isLoading = true;
    let dto: TransferPlayerDTO = {
      leagueId: selectedPlayer.leagueId,
      clubId: selectedPlayer.clubId,
      newLeagueId: transferLeagueId,
      playerId: selectedPlayer.id,
      newClubId: transferClubId,
      newShirtNumber: shirtNumber,
      newValueQuarterMillions: newValueMillions * 4
    };

    let result = await governanceStore.transferPlayer(dto);
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
    shirtNumber = 0;
    newValueMillions = 0;
    isLoading = false;
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>
<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Transfer Player"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p class="my-2">Transfer {selectedPlayer.firstName} {selectedPlayer.lastName}</p>
    <FormComponent label="Transfer to league:">
      <select
        class="brand-dropdown"
        bind:value={transferLeagueId}
      >
        <option value={0}>Select League</option>
        {#each transferLeagues as league}
          <option value={league.id}>{league.name}</option>
        {/each}
      </select>
    </FormComponent>
        
    {#if transferLeagueId > 0}
      <FormComponent label="Transfer to club:">
        <select
          class="brand-dropdown"
          bind:value={transferClubId}
        >
          <option value={0}>Select Club</option>
          {#each transferClubs as club}
            <option value={club.id}>{club.friendlyName}</option>
          {/each}
        </select>
      </FormComponent>

      {#if transferClubId > 0}
        <FormComponent label="New Value (£ millions):">
          <input class="brand-input" type="number" step="0.25" min="0.25" max="250" bind:value={newValueMillions} />    
        </FormComponent>

        <FormComponent label="New Shirt Number:">
          <input
            type="number"
            class="brand-input"
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