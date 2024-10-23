<script lang="ts">
  import { onMount } from "svelte";
  import { toastsError } from "$lib/stores/toasts-store";
  import { leagueStore } from "$lib/stores/league-store";
  import Layout from "../Layout.svelte";
  import { formatUnixDateToReadable, formatUnixDateToSmallReadable, getImageURL } from "$lib/utils/helpers";
  import { userStore } from "$lib/stores/user-store";
  import AddLeagueModal from "$lib/components/governance/league/create-league.svelte";
  import type { CountryDTO, FootballLeagueDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
    import { countryStore } from "$lib/stores/country-store";

  let isAdmin = false; 
  let showAddLeague = false;
  let leagues: FootballLeagueDTO[] = [];
  let countries: CountryDTO[] = [];

  onMount(async () => {
    try {
      isAdmin = await userStore.isAdmin();
      leagues = await leagueStore.getLeagues();
      countries = await countryStore.getCountries();
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching leagues." },
        err: error,
      });
      console.error("Error fetching leagues:", error);
    }
  });

  async function closeModal(){
    showAddLeague = false;
  }
</script>

<Layout>
<div class="page-header-wrapper flex w-full py-10 bg-gradient-to-r from-blue-800 to-blue-600">
  <div class="container mx-auto px-6">
    <div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center w-full mb-4">
        <p class="text-3xl font-bold text-white">League Explorer</p>
        {#if isAdmin}
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            on:click={() => { showAddLeague = true; }}>
            + New League
          </button>
        {/if}
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {#each leagues.sort((a, b) => Number(a.id) - Number(b.id)) as league}
          <div class="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 hover:bg-gray-700 transition duration-300">
            <div class="flex items-center">
              <img
                  src={getImageURL(league.logo)}
                  class="w-12 h-12 object-cover rounded-full border-2 border-gray-600"
                  alt="logo"
              />
              <div class="ml-4">
                <p class="text-md font-bold text-white">{league.name}</p>
                <p class="text-sm text-gray-400">{league.abbreviation} - {league.governingBody}</p>
              </div>
            </div>

            <div class="text-sm text-gray-300 space-y-2">
              <p><span class="font-semibold text-gray-400">Country:</span> {countries.find(x =>x.id == league.countryId)?.name}</p>
              <p><span class="font-semibold text-gray-400">Gender:</span> {Object.keys(league.relatedGender)[0]}</p>
              <p><span class="font-semibold text-gray-400">Teams:</span> {league.teamCount}</p>
              <p><span class="font-semibold text-gray-400">Founded:</span> { formatUnixDateToSmallReadable(Number(league.formed))}</p>
            </div>

            <a href={`/league?id=${league.id}`} class="block text-right">
              <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                View League
              </button>
            </a>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
</Layout>

{#if showAddLeague}
<AddLeagueModal visible={showAddLeague} {closeModal} />
{/if}
