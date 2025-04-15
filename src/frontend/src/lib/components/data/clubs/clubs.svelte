<script lang="ts">
  import { onMount } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import type { Club } from "../../../../../../declarations/backend/backend.did";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import ClubsTable from "./clubs-table.svelte";
  import ClubsFilters from "./clubs-filters.svelte";

  let isLoadingClubs = $state(true);
  let selectedLeagueId: number = $state(1);
  let allLeagueClubs: Record<number, Club[]> = $state({});
  let filteredClubs: Club[] = $state([]);

  onMount(async () => {
    await fetchClubsForLeague(selectedLeagueId);
  });

  $effect(() => {
    if (selectedLeagueId > 0) {
      fetchClubsForLeague(selectedLeagueId);
    }
  });

  function handleFilterChange(newFilteredClubs: Club[]) {
    filteredClubs = [...newFilteredClubs];
  }

  function handleLeagueChange(newLeagueId: number) {
    selectedLeagueId = newLeagueId;
  }

  async function fetchClubsForLeague(leagueId: number) {
    try {
      isLoadingClubs = true;
      if (!allLeagueClubs[leagueId]) {
        let clubsResult = await clubStore.getClubs(leagueId);
        if (!clubsResult) throw new Error("Failed to fetch clubs");
        allLeagueClubs = {
          ...allLeagueClubs,
          [leagueId]: [...clubsResult.clubs],
        };
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      isLoadingClubs = false;
    }
  }
</script>

{#if isLoadingClubs}
  <LocalSpinner />
{:else}
  <ClubsFilters
    {allLeagueClubs}
    {selectedLeagueId}
    onFilter={handleFilterChange}
    onLeagueChange={handleLeagueChange}
  />
  <ClubsTable clubs={filteredClubs} />
{/if}