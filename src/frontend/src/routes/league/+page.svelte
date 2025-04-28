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
    
    const tabs = [
        { id: 'clubs', label: 'Clubs' },
        { id: 'fixtures', label: 'Fixtures' },
        { id: 'postponed-fixtures', label: 'Postponed Fixtures' },
        { id: 'loaned-players', label: 'Loaned Players' },
    ]
    
    let isLoading = true;
    let countryIds: CountryId[] = [];
    let countries: Country[] = [];
    let league: League | null = null;
    let leagueStatus: LeagueStatus | null = null;
    
    let activeTab: string = "clubs";
    
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
    <FullScreenSpinner />
  {:else}
    {#if league}
      <LeagueGridDisplay {league} {leagueStatus} {countries} />

      <div class="flex mb-6 md:px-1">
        <TabPanel {activeTab} {setActiveTab} {tabs} />
      </div>

      {#if activeTab === "clubs"}
        <LeagueClubs leagueId={league.id} />
      {/if}
      {#if activeTab === "fixtures"}
        <LeagueFixtures leagueId={league.id} />
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