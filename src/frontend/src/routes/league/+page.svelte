<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { countryStore } from "$lib/stores/country-store"; 
    import { leagueStore } from "$lib/stores/league-store";
    import type { Country, CountryId, League, LeagueStatus } from "../../../../declarations/backend/backend.did";
    
    import LeagueGridDisplay from "$lib/components/league/league-grid-display.svelte";
    import LeagueClubs from "$lib/components/league/league-clubs.svelte";
    import LeagueFixtures from "$lib/components/league/league-fixtures.svelte";
    import LeagueLoanedPlayers from "$lib/components/league/league-loaned-players.svelte";
    import PostponedLeagueFixtures from "$lib/components/league/postponed-league-fixtures.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import TabPanel from "$lib/components/shared/tab-panel.svelte";
    import type { Club } from "../../../../declarations/data_canister/data_canister.did";
    
    const tabs = [
        { id: 'clubs', label: 'Clubs' },
        { id: 'fixtures', label: 'Fixtures' },
        { id: 'postponed-fixtures', label: 'Postponed Fixtures' },
        { id: 'loaned-players', label: 'Loaned Players' },
    ]
    
    let isLoading = $state(true);
    let countryIds: CountryId[] = [];
    let countries: Country[] = $state([]);
    let league: League | null = $state(null);
    let leagueStatus: LeagueStatus | null = $state(null);
    let clubs: Club[] = $state([]);
    
    let activeTab: string = $state("clubs");
    
    let id = Number($page.url.searchParams.get("id"));
  
    onMount(async () => {
      try {
        await loadData();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading = false;
      }
    });

    async function loadData() {
        let countriesResult = await countryStore.getCountries();
        if (!countriesResult) throw new Error("Failed to fetch countries");

        countries = [...countriesResult.countries]; // Create a new array
        countryIds = countries.map(x => x.id); // This is fine as it creates a new array
        let leaguesResult = await leagueStore.getLeagues();
        if (!leaguesResult) throw new Error("Error fetching leagues.");
        let leagues = leaguesResult.leagues;
        league = leagues.find((x) => x.id == id) ?? null;

        try {
            let leagueStatusResult = await leagueStore.getLeagueStatus(id);
            if (!leagueStatusResult) throw new Error("Failed to fetch league status");
            leagueStatus = leagueStatusResult;
        } catch (error) {
            leagueStatus = null;
        }
        }

    async function setActiveTab(tab: string): Promise<void> {
      activeTab = tab;
    }
</script>

  {#if isLoading}
    <FullScreenSpinner message='Loading League' />
  {:else}
    {#if league}
      <LeagueGridDisplay {league} {leagueStatus} {countries} />

      <div class="flex mb-6 md:px-1">
        <TabPanel {activeTab} {setActiveTab} {tabs} />
      </div>

      {#if activeTab === "clubs" && clubs.length > 0}
        <LeagueClubs {league} {clubs} />
      {/if}
      {#if activeTab === "fixtures" && clubs.length > 0 && leagueStatus}
        <LeagueFixtures {league} {clubs} {leagueStatus} gameweeks={Array.from({ length: leagueStatus.totalGameweeks }, (_, index) => index + 1)} />
      {/if}
      {#if activeTab === "postponed-fixtures"}
        <PostponedLeagueFixtures leagueId={league.id} />
      {/if}
      {#if activeTab === "loaned-players"}
        <LeagueLoanedPlayers leagueId={league.id} />
      {/if}
    {:else}
      <p>Leagues not found.</p>
    {/if}
  {/if}  