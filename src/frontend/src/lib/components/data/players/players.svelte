<script lang="ts">

    /* ----- Imports ----- */

    import { onMount } from "svelte";
    import { playerStore } from "$lib/stores/player-store";
    import type { Club, Player } from "../../../../../../declarations/backend/backend.did";

  
    /* ----- Components ----- */

    import CreatePlayer from "$lib/components/governance/proposals/player/create-player.svelte";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import PlayersTable from "./players-table.svelte";
    import PlayersFilters from "./players-filters.svelte";
      

    /* ----- Loading Variables ----- */

    let isLoading = $state(true);
    let showCreatePlayerModal = $state(false);
    

    /* ----- Filter State Variables ----- */

    let selectedLeagueId: number = $state(1);
    let selectedClubId: number = $state(0);


    /* ----- Data State Variables ----- */

    let clubs: Club[] = $state([]);
    let allLeaguePlayers: Record<number, Player[]> = $state({});
    let filteredPlayers: Player[] = $state([]);
    

    /* ----- Lifecycle ----- */
  
    onMount(async () => {
      try {
        await fetchPlayersForLeague(selectedLeagueId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading = false;
        console.log('mounting complete')
      }
    });

  
    /* ----- Data Getters ----- */

    async function fetchPlayersForLeague(leagueId: number) {
      console.log('fetchPlayersForLeague')
      if (!allLeaguePlayers[leagueId]) {
        try {
          let playersResult = await playerStore.getPlayers(leagueId);
          if (!playersResult) throw new Error("Failed to fetch players");
          allLeaguePlayers = { ...allLeaguePlayers, [leagueId]: [...playersResult.players] }; // Immutable update
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }
      console.log('fetchPlayersForLeague complete')
    }


    /* ----- Modal Toggle Functions ----- */

    function createNewPlayer() {
      showCreatePlayerModal = true;
    }

    function closeModal(){
        showCreatePlayerModal = false;
    }
  
  </script>
  
{#if isLoading}
  <LocalSpinner />
{:else}

  <div class="flex items-center justify-between w-full my-4">
    <button class="brand-button" onclick={createNewPlayer}>+ New Player</button>
  </div>
  
  <PlayersFilters {fetchPlayersForLeague} {clubs} {allLeaguePlayers} {filteredPlayers} />
  <PlayersTable players={filteredPlayers} {clubs} />
      
{/if}

{#if showCreatePlayerModal}
    <CreatePlayer visible={showCreatePlayerModal} {closeModal} {selectedLeagueId} {selectedClubId} />
{/if}