<script lang="ts">
  import { onMount } from "svelte";
  import { playerStore } from "$lib/stores/player-store";
  import { clubStore } from "$lib/stores/club-store";
  import type { Club, Player } from "../../../../../../declarations/backend/backend.did";
  import CreatePlayer from "$lib/components/governance/proposals/player/create-player.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import PlayersTable from "./players-table.svelte";
  import PlayersFilters from "./players-filters.svelte";

  let isLoadingClubs = $state(true);
  let isLoadingPlayers = $state(true);
  let showCreatePlayerModal = $state(false);
  let selectedLeagueId = $state(1);
  let selectedClubId = $state(0);
  let clubs: Club[] = $state([]);
  let allLeaguePlayers: Record<number, Player[]> = $state({});
  let filteredPlayers: Player[] = $state([]);

  onMount(async () => {
    await fetchPlayersForLeague(selectedLeagueId);
    await fetchClubsForLeague();
  });

  async function fetchPlayersForLeague(leagueId: number) {
    try {
      isLoadingPlayers = true;
      if (!allLeaguePlayers[leagueId]) {
        const playersResult = await playerStore.getPlayers(leagueId);
        if (!playersResult) throw new Error("Failed to fetch players");
        allLeaguePlayers[leagueId] = [...playersResult.players];
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      isLoadingPlayers = false;
    }
  }

  async function fetchClubsForLeague() {
    try {
      isLoadingClubs = true;
      const clubsResult = await clubStore.getClubs(selectedLeagueId);
      if (!clubsResult) throw new Error("Failed to fetch clubs");
      clubs = [...clubsResult.clubs];
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      isLoadingClubs = false;
    }
  }

  function handleFilterChange(newFilteredPlayers: Player[]) {
    filteredPlayers = [...newFilteredPlayers];
  }

  function createNewPlayer() {
    showCreatePlayerModal = true;
  }

  function closeModal() {
    showCreatePlayerModal = false;
  }
</script>

<div class="flex items-center justify-between w-full my-4">
  <button class="brand-button" onclick={createNewPlayer}>+ New Player</button>
</div>

{#if isLoadingPlayers || isLoadingClubs}
  <LocalSpinner />
{:else}
  <PlayersFilters
    {fetchPlayersForLeague}
    {clubs}
    {allLeaguePlayers}
    {selectedLeagueId}
    {selectedClubId}
    onFilter={handleFilterChange}
  />
  <PlayersTable players={filteredPlayers} {clubs} />
{/if}

{#if !isLoadingPlayers && !isLoadingClubs && showCreatePlayerModal}
  <CreatePlayer
    visible={showCreatePlayerModal}
    {closeModal}
    {selectedLeagueId}
    {selectedClubId}
  />
{/if}