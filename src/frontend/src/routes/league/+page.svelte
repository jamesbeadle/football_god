<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    
    import { formatUnixDateToSmallReadable, getImageURL } from "$lib/utils/helpers";
    import { countryStore } from "$lib/stores/country-store"; 
    import { leagueStore } from "$lib/stores/league-store";
    
    import type { CountryDTO, FootballLeagueDTO } from "../../../../declarations/backend/backend.did";
    
    import Layout from "../Layout.svelte";
    import LeagueClubs from "$lib/components/league/league-clubs.svelte";
    import LeagueFixtures from "$lib/components/league/league-fixtures.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    
    let isLoading = true;
    let countries: CountryDTO[] = [];
    let league: FootballLeagueDTO | null = null;
    
    let activeTab: string = "clubs";
    
    $: id = Number($page.url.searchParams.get("id"));
  
    onMount(async () => {
      try {
        await loadData();
      } catch (error) {
        console.error("Error fetching league details:", error);
      } finally {
        isLoading = false;
      }
    });

    async function loadData(){
      countries = await countryStore.getCountries();
      let leagues = await leagueStore.getLeagues();      
      league = leagues.find((x) => x.id == id) ?? null;
    };
  
    function setActiveTab(tab: string): void {
      activeTab = tab;
    }
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    {#if league}

      <div class="flex flex-col space-y-4 p-4 mb-4">
        <div class="flex items-center space-x-4">
          <img src={getImageURL(league.logo)} alt="logo" class="w-8 h-8" />
          <h1 class="text-xl">{league.name}</h1>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="abbreviated-name" class="block text-xs">Abbreviated Name</label>
            <p>{league.abbreviation}</p>
          </div>
          <div>
            <label for="governing-body" class="block text-xs">Governing Body</label>
            <p>{league.governingBody}</p>
          </div>
          <div>
            <label for="related-gender" class="block text-xs">Gender</label>
            <p>{Object.keys(league.relatedGender)[0]}</p>
          </div>
          <div>
            <label for="formed" class="block text-xs">Date Formed</label>
            <p>{formatUnixDateToSmallReadable(Number(league.formed))}</p>
          </div>
          <div>
            <label for="country" class="block text-xs">Country</label>
            <p>{ countries.find(x => x.id == league?.countryId)?.name }</p>
          </div>
        </div>
      </div>

      <div class="flex space-x-4 px-2 mb-4">
        <button 
          class={`p-2 ${activeTab === "clubs" ? "text-white border-b-2 border-white" : "text-BrandDisabled"}`} 
          on:click={() => setActiveTab("clubs")}>
          Clubs
        </button>
        <button 
          class={`p-2 ${activeTab === "fixtures" ? "text-white border-b-2 border-white" : "text-BrandDisabled"}`} 
          on:click={() => setActiveTab("fixtures")}>
          Fixtures
        </button>
      </div>

      {#if activeTab === "clubs"}
        <LeagueClubs leagueId={league.id} />
      {/if}
      {#if activeTab === "fixtures"}
        <LeagueFixtures leagueId={league.id} />
      {/if}
    {:else}
      <p>League not found.</p>
    {/if}
  {/if}

</Layout>
  