<script lang="ts">
    import { onMount } from "svelte";
    import { toastsError } from "$lib/stores/toasts-store";
    import { leagueStore } from "$lib/stores/league-store";
    import Layout from "../Layout.svelte";
    import { getImageURL } from "$lib/utils/helpers";
    import { userStore } from "$lib/stores/user-store";
    import AddLeagueModal from "$lib/components/governance/league/create-league.svelte";
    import type { FootballLeagueDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";

    let isAdmin = false; 
    let showAddLeague = false;
    let leagues: FootballLeagueDTO[] = [];
  
    onMount(async () => {
      try {
        isAdmin = await userStore.isAdmin();
        leagues = await leagueStore.getLeagues();
      } catch (error) {
        toastsError({
          msg: { text: "Error fetching leagues." },
          err: error,
        });
        console.error("Error fetching leagues:", error);
      } finally {
      }
    });

    async function closeModal(){
      showAddLeague = false;
    }
  </script>
  
<Layout>
  <div class="page-header-wrapper flex w-full">
    <div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center w-full mb-4">
        <p class="text-2xl font-bold text-white">League Explorer</p>
        <button 
          class="brand-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          on:click={() => { showAddLeague = true ;}}>
          + New League
        </button>
      </div>
      
      <div>
        {#each leagues.sort((a, b) => Number(a.id) - Number(b.id)) as league}
          <div class="flex flex-row items-center bg-gray-700 rounded shadow p-4 w-full my-2">
            <div class="flex items-center space-x-4 w-full">
                <img
                    src={getImageURL(league.logo)}
                    class="w-8"
                    alt="logo"
                />
                <p class="flex-grow text-lg md:text-sm">{league.name}</p>
                <a class="mt-auto self-end" href={`/league?id=${league.id}`}>
                    <button
                    class="brand-button text-white font-bold py-2 px-4 rounded self-end"
                    >
                    View
                    </button>
                </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</Layout>

{#if showAddLeague}
  <AddLeagueModal visible={showAddLeague} {closeModal} />
{/if}
