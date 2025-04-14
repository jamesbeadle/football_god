<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { leagueStore } from "$lib/stores/league-store";
    import { convertDateToReadable, getImageURL } from "$lib/utils/helpers";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import AddLeagueModal from "$lib/components/governance/proposals/league/create-league.svelte";
    import UpdateLeagueModal from "$lib/components/governance/proposals/league/update-league.svelte";
    import PipsIcon from "$lib/icons/pips-icon.svelte";
    import type { League, Leagues } from "../../../../../declarations/backend/backend.did";
      
    let isLoading = true;
    let showAddLeague = false;
    let showUpdateLeague = false;
    let leagues: Leagues | null = null;
    let dropdownVisible: number | null = null;
    let selectedLeague: League;
  
    onMount(async () => {
      document.addEventListener("click", handleClickOutside);
      try {
        var leaguesResult = await leagueStore.getLeagues();
        if(!leaguesResult){ return }
        leagues = leaguesResult;
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        isLoading = false;
      }
    });
  
    onDestroy(() => {
      document.removeEventListener("click", handleClickOutside);
    });
  
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest(".dropdown-container")) {
        closeDropdown();
      }
    };
  
    function closeDropdown() {
      dropdownVisible = null;
    }
  
    async function closeModal(){
      showAddLeague = false;
      showUpdateLeague = false;
    }
  
    function createNewLeague() {
      showAddLeague = true;
    }
  
    function updateLeague(leagueId: number) {
      selectedLeague = getLeagueById(leagueId);
      showUpdateLeague = true;
    }
  
    function getLeagueById(leagueId: number) {
      return leagues?.leagues.find(league => league.id === leagueId) as League;
    }
  
    function toggleDropdown(leagueId: number, event: MouseEvent) {
        event.stopPropagation();
        dropdownVisible = dropdownVisible === leagueId ? null : leagueId;
    }
  
    function viewLeague(leagueId: number) {
      goto(`/league?id=${leagueId}`);
    } 
  
  </script>
  
{#if isLoading}
    <LocalSpinner />
{:else}
    <div class="flex items-center justify-between w-full my-4">
      <button class="brand-button" onclick={createNewLeague}>+ New League</button>
    </div>
    
    <div class="px-2 pb-4 space-y-4 mb:px-0">
    {#each leagues!.leagues.sort((a, b) => Number(a.id) - Number(b.id)) as league}
        <div class="flex flex-row items-center justify-between w-full p-4 transition rounded-lg shadow bg-BrandGray hover:bg-BrandLightGray">
        <div class="flex items-center space-x-4">
            <img
            src={getImageURL(league.logo)}
            class="object-cover w-12 h-12 border-2 border-gray-600 rounded-full"
            alt="logo"
            />
            <div>
            <p class="font-bold text-md text-BrandActive">{league.name}</p>
            <p class="text-sm text-BrandLightGray">
                {Object.keys(league.relatedGender)[0]} • {league.teamCount} Teams • Formed:{" "}
                { convertDateToReadable(Number(league.formed))}
            </p>
            </div>
        </div>

        <div class="relative">
            <button
            class="px-3 py-1"
            onclick={(event) => toggleDropdown(league.id, event)}
            >
            <PipsIcon className="w-6" />
            </button>
            {#if dropdownVisible === league.id}
            <div
                class="absolute right-0 z-10 w-48 mt-2 rounded-lg shadow-lg bg-BrandDarkGray"
            >
                <button
                class="block w-full px-4 py-2 text-left text-BrandActive hover:bg-BrandLightGray"
                onclick={() => viewLeague(league.id)}
                >
                View Details
                </button>
                <button
                class="block w-full px-4 py-2 text-left text-BrandActive hover:bg-BrandLightGray"
                onclick={() => updateLeague(league.id)}
                >
                Update League
                </button>
            </div>
            {/if}
        </div>
        </div>
    {/each}
    </div>

{/if}
  
  {#if showAddLeague}
    <AddLeagueModal visible={showAddLeague} {closeModal} />
  {/if}
  
  {#if showUpdateLeague}
    <UpdateLeagueModal visible={showUpdateLeague} {closeModal} {selectedLeague} />
  {/if}
  