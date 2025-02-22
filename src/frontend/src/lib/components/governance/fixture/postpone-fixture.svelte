<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { isError } from "$lib/utils/helpers";
  import type { ClubDTO, FixtureDTO, PostponeFixtureDTO } from "../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/modal.svelte";
  import GovernanceModal from "../governance-modal.svelte";
  import { toasts } from "$lib/stores/toasts-store";
    
  export let visible: boolean;
  export let closeModal: () => void;
  export let selectedFixture: FixtureDTO;
  export let selectedLeagueId: number;

  let gameweeks = Array.from({ length: Number(process.env.TOTAL_GAMEWEEKS) }, (_, i) => i + 1);
  let clubs: ClubDTO[] = [];
  let homeClub: ClubDTO;
  let awayClub: ClubDTO;
  
  $: isSubmitDisabled = false;

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  onMount(async () => {
    try {
      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      gameweeks = Array.from({ length: leagueStatus.totalGameweeks }, (_, i) => i + 1);
      if(selectedLeagueId > 0){
          clubs = await clubStore.getClubs(selectedLeagueId);
      }
      homeClub = clubs.find(x => x.id == selectedFixture.homeClubId)!;
      awayClub = clubs.find(x => x.id == selectedFixture.awayClubId)!;
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

      let leagueStatus = await leagueStore.getLeagueStatus(selectedLeagueId);
      if(!leagueStatus){
        return
      }

      let dto: PostponeFixtureDTO = {
        leagueId: selectedLeagueId,
        seasonId: leagueStatus.activeSeasonId,
        fixtureId : selectedFixture.id
      };
      submitting = true;

      let result = await governanceStore.postponeFixture(dto);
      if (isError(result)) {
        isLoading = false;
        console.error("Error submitting proposal");
        return;
      }

      submitted = true;
      submitting = false;
      toasts.addToast({
        message: "Proposal submitted successfully",
        type: "success",
        duration: 3000,
      });
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
  }

  function cancelModal() {
    resetForm();
    closeModal();
  }
</script>

<Modal showModal={visible} onClose={closeModal}>
  <GovernanceModal title={"Postpone Fixture"} {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Postpone {homeClub.friendlyName} v {awayClub.friendlyName} - Gameweek {selectedFixture.gameweek}</p>
  </GovernanceModal>
</Modal>