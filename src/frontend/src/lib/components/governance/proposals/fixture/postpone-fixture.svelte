<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { toasts } from "$lib/stores/toasts-store";
  import { isError } from "$lib/utils/helpers";
  import type { Club, Fixture } from "../../../../../../../declarations/backend/backend.did";
  import type { PostponeFixture } from "../../../../../../../declarations/data_canister/data_canister.did";
  import Modal from "$lib/components/shared/global/modal.svelte";
  import GovernanceModal from "../../voting/governance-modal.svelte";

  interface Props {
    visible: boolean;
    closeModal: () => void;
    selectedLeagueId: number;
    selectedFixture: Fixture;
  }

  let { visible, closeModal, selectedLeagueId, selectedFixture }: Props = $props();

  let gameweeks = Array.from({ length: Number(process.env.TOTAL_GAMEWEEKS) }, (_, i) => i + 1);
  let clubs: Club[] = [];
  let homeClub: Club | undefined = $state(undefined);
  let awayClub: Club | undefined = $state(undefined);

  let isLoading = $state(false);
  let submitting = $state(false);
  let submitted = $state(false);
  let isSubmitDisabled = $state(true);

  onMount(async () => {
    try {
      let leagueStatusResult = await leagueStore.getLeagueStatus(selectedLeagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;
        gameweeks = Array.from({ length: leagueStatus.totalGameweeks }, (_, i) => i + 1);
        if(selectedLeagueId > 0){
          let clubsResult = await clubStore.getClubs(selectedLeagueId);
          if(!clubsResult) throw new Error("Error loading clubs")
          clubs = clubsResult.clubs;
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

      let leagueStatusResult = await leagueStore.getLeagueStatus(selectedLeagueId);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        let leagueStatus = leagueStatusResult;

      let dto: PostponeFixture = {
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

<Modal title={"Postpone Fixture"} onClose={closeModal}>
  <GovernanceModal {cancelModal} {confirmProposal} {isLoading} {isSubmitDisabled}>
    <p>Postpone {homeClub!.friendlyName} v {awayClub!.friendlyName} - Gameweek {selectedFixture.gameweek}</p>
  </GovernanceModal>
</Modal>