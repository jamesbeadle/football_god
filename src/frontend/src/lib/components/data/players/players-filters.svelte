<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import type { Club, Country, League, Player } from "../../../../../../declarations/backend/backend.did";
  import FormComponent from "$lib/components/shared/form-component.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";

  interface Props {
    allLeaguePlayers: Record<number, Player[]>;
    selectedLeagueId: number;
    selectedClubId: number;
    clubs: Club[];
    fetchPlayersForLeague: (leagueId: number) => Promise<void>;
    onFilter: (filteredPlayers: Player[]) => void;
  }

  let {
    selectedLeagueId,
    selectedClubId,
    clubs,
    allLeaguePlayers,
    fetchPlayersForLeague,
    onFilter,
  }: Props = $props();

  let isLoading = $state(true);
  let leagues: League[] = $state([]);
  let countries: Country[] = $state([]);
  let selectedPositionId = $state(0);
  let selectedNationalityId = $state(0);
  let minValue = $state(0);
  let maxValue = $state(150);
  let searchSurname = $state("");
  let debouncedSearch = $state("");

  $effect(() => {
    const timer = setTimeout(() => {
      debouncedSearch = searchSurname.trim();
    }, 300);
    return () => clearTimeout(timer);
  });

  let leagueOptions = $derived(
    leagues.map((league) => ({ id: league.id, label: league.name }))
  );
  let clubOptions = $derived(
    clubs.map((club) => ({ id: club.id, label: club.friendlyName }))
  );
  let positions = [
    { id: 1, positionName: "Goalkeeper" },
    { id: 2, positionName: "Defender" },
    { id: 3, positionName: "Midfielder" },
    { id: 4, positionName: "Forward" },
  ];
  let positionOptions = $derived(
    positions.map((pos) => ({ id: pos.id, label: pos.positionName }))
  );
  let nationalityOptions = $derived(
    countries.map((country) => ({ id: country.id, label: country.name }))
  );

  onMount(async () => {
    try {
      const [countriesResult, leaguesResult, clubsResult] = await Promise.all([
        countryStore.getCountries(),
        leagueStore.getLeagues(),
        clubStore.getClubs(selectedLeagueId),
      ]);

      if (!countriesResult || !leaguesResult || !clubsResult) {
        throw new Error("Failed to fetch data");
      }

      countries = countriesResult.countries;
      leagues = leaguesResult.leagues;
      clubs = clubsResult.clubs;

      await fetchPlayersForLeague(selectedLeagueId);
      applyFilters();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  });

  function applyFilters() {
    const leaguePlayers = allLeaguePlayers[selectedLeagueId] || [];
    const minValueNum = Number(minValue) || 0;
    const maxValueNum = Number(maxValue) || 150;
    const searchTerm = debouncedSearch.toLowerCase().trim();
    const filterPosition =
      selectedPositionId === 1
        ? "Goalkeeper"
        : selectedPositionId === 2
        ? "Defender"
        : selectedPositionId === 3
        ? "Midfielder"
        : selectedPositionId === 4
        ? "Forward"
        : null;

    const filtered = leaguePlayers.filter(
      (player) =>
        (!filterPosition || Object.keys(player.position)[0] === filterPosition) &&
        (selectedClubId === 0 || Number(player.clubId) === selectedClubId) &&
        (selectedNationalityId === 0 ||
          Number(player.nationality) === selectedNationalityId) &&
        player.valueQuarterMillions / 4 >= minValueNum &&
        player.valueQuarterMillions / 4 <= maxValueNum &&
        (searchTerm === "" || player.lastName.toLowerCase().includes(searchTerm))
    );

    onFilter(filtered);
  }

  $effect(() => {
    applyFilters();
  });

  $effect(() => {
    if (selectedLeagueId && selectedLeagueId > 0) {
      isLoading = true;
      fetchPlayersForLeague(selectedLeagueId).then(() => {
        filterClubs();
        isLoading = false;
      });
    }
  });

  async function filterClubs() {
    const clubsResult = await clubStore.getClubs(selectedLeagueId);
    if (!clubsResult) throw new Error("Error loading clubs");
    clubs = [...clubsResult.clubs];
  }

  function onSearch() {
    searchSurname = searchSurname.trim();
  }

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onSearch();
    }
  }
</script>

{#if isLoading ||
  (
    leagueOptions.length == 0 || 
    clubOptions.length == 0 || 
    positionOptions.length == 0 ||
    nationalityOptions.length == 0
  )
}
  <LocalSpinner />
{:else}
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormComponent label="Select League">
        <select
          class="brand-dropdown"
          bind:value={selectedLeagueId}
        >
          {#each leagueOptions as league}
            <option value={league.id}>{league.label}</option>
          {/each}
        </select>
      </FormComponent>
      <FormComponent label="Select Club">
        <select
          class="brand-dropdown"
          bind:value={selectedClubId}
        >
          <option value={0}>All Clubs</option>
          {#each clubOptions as club}
            <option value={club.id}>{club.label}</option>
          {/each}
        </select>
      </FormComponent>
    </div>
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormComponent label="Select Position">
        <select
          class="brand-dropdown"
          bind:value={selectedPositionId}
        >
          <option value={0}>All Positions</option>
          {#each positionOptions as position}
            <option value={position.id}>{position.label}</option>
          {/each}
        </select>
      </FormComponent>
      <FormComponent label="Select Nationality">
        <select
          class="brand-dropdown"
          bind:value={selectedNationalityId}
        >
          <option value={0}>All Nationalities</option>
          {#each nationalityOptions as country}
            <option value={country.id}>{country.label}</option>
          {/each}
        </select>
      </FormComponent>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="w-full px-3 md:px-0">
        <label for="minValue" class="block mb-1 text-xs text-white">Min Value (M):</label>
        <input
          type="number"
          id="minValue"
          bind:value={minValue}
          step="0.25"
          min="0"
          class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
          placeholder="0"
        />
      </div>
      <div class="w-full px-3 md:px-0">
        <label for="maxValue" class="block mb-1 text-xs text-white">Max Value (M):</label>
        <input
          type="number"
          id="maxValue"
          bind:value={maxValue}
          step="0.25"
          min="0"
          class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
          placeholder="150"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <label for="searchSurname" class="block px-3 mb-1 text-xs text-white md:px-0">
          Search by Surname:
        </label>
        <div class="flex px-3 space-x-2 md:px-0">
          <input
            type="text"
            id="searchSurname"
            bind:value={searchSurname}
            class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
            placeholder="Enter surname"
            onkeypress={onKeyPress}
          />
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