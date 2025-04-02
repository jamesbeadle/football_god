<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { countryStore } from "$lib/stores/country-store"; 
    import { leagueStore } from "$lib/stores/league-store";
    
    import Layout from "../+layout.svelte";
    import LeagueClubs from "$lib/components/league/league-clubs.svelte";
    import LeagueFixtures from "$lib/components/league/league-fixtures.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import type { Country, League, LeagueStatus } from "../../../../declarations/data_canister/data_canister.did";
    import LeagueLoanedPlayers from "$lib/components/league/league-loaned-players.svelte";
    import PostponedLeagueFixtures from "$lib/components/league/postponed-league-fixtures.svelte";
    import TabContainer from "$lib/components/shared/tab-container.svelte";
    import LeagueGridDisplay from "$lib/components/league/league-grid-display.svelte";

    const tabs = [
        { id: 'clubs', label: 'Clubs' },
        { id: 'fixtures', label: 'Fixtures' },
        { id: 'postponed-fixtures', label: 'Postponed Fixtures' },
        { id: 'loaned-players', label: 'Loaned Players' },
    ]
    
    let isLoading = true;
    let countries: Country[] = [];
    let league: League | null = null;
    let leagueStatus: LeagueStatus | null = null;
    
    let filterType: string = "clubs";
    
    $: id = Number($page.url.searchParams.get("id"));
  
    onMount(async () => {
      try {
        await loadData();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading = false;
      }
    });

    async function loadData(){
      let countriesResult = await countryStore.getCountries();
      if(!countriesResult) throw new Error("Failed to fetch countries");
      countries = countriesResult.countries;
      let leaguesResult = await leagueStore.getLeagues();
      if(!leaguesResult) throw new Error("Error fetching leagues.");
      let leagues = leaguesResult.leagues;     
      league = leagues.find((x) => x.id == id) ?? null;
      
      try {
        let leagueStatusResult = await leagueStore.getLeagueStatus(id);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        leagueStatus = leagueStatusResult;
        
      } catch (error) {
        leagueStatus = null;
      }
    };

    async function setActiveTab(tab: string): Promise<void> {
      filterType = tab;
    }
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    {#if league}
      <LeagueGridDisplay {league} {leagueStatus} {countries} />

      <div class="flex mb-6 md:px-1">
        <TabContainer {filterType} {setActiveTab} {tabs} compact={true} />
      </div>

      {#if filterType === "clubs"}
        <LeagueClubs leagueId={league.id} />
      {/if}
      {#if filterType === "fixtures"}
        <LeagueFixtures leagueId={league.id} />
      {/if}
      {#if filterType === "postponed-fixtures"}
        <PostponedLeagueFixtures leagueId={league.id} />
      {/if}
      {#if filterType === "loaned-players"}
        <LeagueLoanedPlayers leagueId={league.id} />
      {/if}
    {:else}
      <p>Leagues not found.</p>
    {/if}
  {/if}

</Layout>
  