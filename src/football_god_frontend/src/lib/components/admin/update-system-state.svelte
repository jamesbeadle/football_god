<script lang="ts">
    import { leagueStore } from "$lib/stores/league-store";
    import { toastsError, toastsShow } from "$lib/stores/toasts-store";
    import { Modal, busyStore } from "@dfinity/gix-components";
    import type { LeagueId } from "../../../../../declarations/football_god_backend/football_god_backend.did";
    import { adminStore } from "$lib/stores/admin-store";
  
    export let visible: boolean;
    export let closeModal: () => void;
    export let cancelModal: () => void;

    let applicationCanisterId: string;
    let calculationSeasonId: number;
    let calculationMonth: number;
    let calculationGameweek: number;
    let pickTeamSeasonId: number;
    let pickTeamMonth: number;
    let pickTeamGameweek: number;
    let onHold: number;
    
    async function updateSystemState() {
      busyStore.startBusy({
        initiator: "update-system-state",
        text: "Updating system state...",
      });
      try {
        /*
        let dto: UpdateSystemState = {

        };
        await adminStore.updateSystemState(applicationCanisterId, dto);
        */
        await closeModal();
        toastsShow({
          text: "System State updated.",
          level: "success",
          duration: 2000,
        });
      } catch (error) {
        toastsError({
          msg: { text: "Error updating system state." },
          err: error,
        });
        console.error("Error updating system state:", error);
        cancelModal();
      } finally {
        busyStore.stopBusy("update-name");
      }
    }
  </script>
  
  <Modal {visible} on:nnsClose={cancelModal}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center my-2">
        <h3 class="default-header">Update System State</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
    </div>
  </Modal>
  