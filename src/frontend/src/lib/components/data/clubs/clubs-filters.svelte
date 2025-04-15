<script lang="ts">
  import { onMount } from "svelte";
  import { leagueStore } from "$lib/stores/league-store";
  import type { Club, League } from "../../../../../../declarations/backend/backend.did";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";

  interface Props {
    allLeagueClubs: Record<number, Club[]>;
    selectedLeagueId: number;
    onFilter: (filteredClubs: Club[]) => void;
    onLeagueChange: (leagueId: number) => void;
  }

  let {
    selectedLeagueId,
    allLeagueClubs,
    onFilter,
    onLeagueChange,
  }: Props = $props();

  let isLoading = $state(true);
  let leagues: League[] = $state([]);
  let searchClubName = $state("");
  let debouncedSearch = $state("");

  $effect(() => {
    const timer = setTimeout(() => {
      debouncedSearch = searchClubName.trim();
    }, 300);
    return () => clearTimeout(timer);
  });

  let leagueOptions = $derived(
    leagues.map((league) => ({
      id: league.id,
      label: league.name,
    }))
  );

  onMount(async () => {
    try {
      const leaguesResult = await leagueStore.getLeagues();
      if (!leaguesResult) throw new Error("Failed to fetch leagues");
      leagues = leaguesResult.leagues;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  });

  $effect(() => {
    const leagueClubs = allLeagueClubs[selectedLeagueId] || [];
    const searchTerm = debouncedSearch.toLowerCase().trim();
    const filtered = leagueClubs.filter(
      (club) =>
        searchTerm === "" || club.friendlyName.toLowerCase().includes(searchTerm)
    );
    onFilter(filtered);
  });

  function handleLeagueChange(value: string | number) {
    onLeagueChange(Number(value));
  }

  function onSearch() {
    searchClubName = searchClubName.trim();
  }

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onSearch();
    }
  }
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="w-full">
        <FormComponent label="Select League">
          <select
            class="brand-dropdown"
            value={selectedLeagueId}
            onchange={(e) => handleLeagueChange(e.currentTarget.value)}
          >
            {#each leagueOptions as league}
              <option value={league.id}>{league.label}</option>
            {/each}
          </select>
        </FormComponent>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <label for="searchClubName" class="block px-3 mb-1 text-xs text-white md:px-0">
          Search by Club Name:
        </label>
        <div class="flex px-3 space-x-2 md:px-0">
          <div class="relative flex-1">
            <input
              type="text"
              id="searchClubName"
              bind:value={searchClubName}
              class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
              placeholder="Enter club name"
              onkeypress={onKeyPress}
            />
          </div>
          <button
            class="px-4 py-2 text-sm text-white transition-colors rounded-lg bg-BrandPurple hover:bg-BrandPurple/80 focus:outline-none focus:ring-2 focus:ring-BrandPurple"
            onclick={onSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}