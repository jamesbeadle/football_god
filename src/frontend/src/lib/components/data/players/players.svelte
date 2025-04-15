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
    import { clubStore } from "$lib/stores/club-store";
      

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
    $effect(() => {
      filteredPlayers = allLeaguePlayers[selectedLeagueId] || [];
    });

    $effect(() => {
      if(selectedLeagueId > 0){
        setClubs();
      }
    });

    async function setClubs(){
      let clubsResult = await clubStore.getClubs(selectedLeagueId);
      if(!clubsResult) throw new Error("Failed to fetch clubs");
      clubs = clubsResult.clubs;
    }
    

    /* ----- Lifecycle ----- */
  
    onMount(async () => {
      try {
        await fetchPlayersForLeague(selectedLeagueId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading = false;
      }
    });

  
    /* ----- Data Getters ----- */

    async function fetchPlayersForLeague(leagueId: number) {
      if (!allLeaguePlayers[leagueId]) {
        try {
          let playersResult = await playerStore.getPlayers(leagueId);
          if (!playersResult) throw new Error("Failed to fetch players");
          allLeaguePlayers = {
            ...allLeaguePlayers,
            [leagueId]: [...playersResult.players],
          };
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }
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
  
  {#if clubs.length > 0}
    <PlayersFilters {fetchPlayersForLeague} {clubs} {allLeaguePlayers} {filteredPlayers} {selectedLeagueId} {selectedClubId} />
    <PlayersTable players={filteredPlayers} {clubs} />
  {/if}

{/if}

{#if showCreatePlayerModal}
    <CreatePlayer visible={showCreatePlayerModal} {closeModal} {selectedLeagueId} {selectedClubId} />
{/if}