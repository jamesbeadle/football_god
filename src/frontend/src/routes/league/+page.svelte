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
    import type { LeagueStatus } from "../../../../declarations/data_canister/data_canister.did";
    
    let isLoading = true;
    let countries: CountryDTO[] = [];
    let league: FootballLeagueDTO | null = null;
    let leagueStatus: LeagueStatus | null = null;
    
    let activeTab: string = "clubs";
    
    $: id = Number($page.url.searchParams.get("id"));
  
    onMount(async () => {
      try {
        await loadData();
        leagueStatus = await leagueStore.getLeagueStatus(id);
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
          {#if leagueStatus}
            <div>
              <label for="active-season" class="block text-xs">Active Season</label>
              <p>{leagueStatus.activeSeasonId}</p>
            </div>
            <div>
              <label for="active-month" class="block text-xs">Active Month</label>
              <p>{leagueStatus.activeMonth}</p>
            </div>
            <div>
              <label for="unplayed-gameweek" class="block text-xs">Unplayed Gameweek</label>
              <p>{leagueStatus.unplayedGameweek}</p>
            </div>
            <div>
              <label for="active-gameweek" class="block text-xs">Active Gameweek</label>
              <p>{leagueStatus.activeGameweek}</p>
            </div>
            <div>
              <label for="completed-gameweek" class="block text-xs">Completed Gameweek</label>
              <p>{leagueStatus.completedGameweek}</p>
            </div>
            <div>
              <label for="transfer-window-active" class="block text-xs">Transfer Window Active</label>
              <p>{leagueStatus.transferWindowActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <label for="season-active" class="block text-xs">Season Active</label>
              <p>{leagueStatus.seasonActive ? "Yes" : "No"}</p>
            </div>
          {/if}
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
  