<script lang="ts">
  import { onMount } from "svelte";
  import { countryStore } from "$lib/stores/country-store";
  import { userStore } from "$lib/stores/user-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { convertDateToReadable, formatUnixDateToSmallReadable, getImageURL } from "$lib/utils/helpers";
  import type { CountryDTO, FootballLeagueDTO } from "../../../../declarations/backend/backend.did";
  
  import Layout from "../Layout.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import AddLeagueModal from "$lib/components/governance/league/create-league.svelte";
    import { goto } from "$app/navigation";
    import PipsIcon from "$lib/icons/pips-icon.svelte";
  
  let isLoading = true;
  let isDataManager = false; 
  let showAddLeague = false;
  let leagues: FootballLeagueDTO[] = [];
  let countries: CountryDTO[] = [];
  let dropdownVisible: number | null = null;

  onMount(async () => {
    try {
      isDataManager = await userStore.isDataManager();
      leagues = await leagueStore.getLeagues();
      countries = await countryStore.getCountries();
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      isLoading = false;
    }
  });

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest(".dropdown-container")) {
        closeDropdown();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  function closeDropdown() {
    dropdownVisible = null;
  }

  async function closeModal(){
    showAddLeague = false;
  }

  function createNewLeague() {
    showAddLeague = true;
  }

  function toggleDropdown(leagueId: number, event: MouseEvent) {
      event.stopPropagation();
      dropdownVisible = dropdownVisible === leagueId ? null : leagueId;
  }

  function viewLeague(leagueId: number) {
    goto(`/league?id=${leagueId}`);
  } 

  function updateLeague(leagueId: number) {
    //TODO: Implement with modal
  }

</script>

<Layout>
  {#if isLoading}
    <LocalSpinner />
  {:else}
    <div class="flex justify-between items-center w-full mb-4">
      <p class="text-lg">League Explorer</p>
      <button class="brand-button" on:click={createNewLeague}>+ League Explorer</button>
    </div>
    
    <div class="space-y-4">
      {#each leagues.sort((a, b) => Number(a.id) - Number(b.id)) as league}
        <div
          class="flex flex-row items-center justify-between bg-BrandGray rounded-lg shadow p-4 w-full hover:bg-BrandLightGray transition"
        >
          <div class="flex items-center space-x-4">
            <img
              src={getImageURL(league.logo)}
              class="w-12 h-12 object-cover rounded-full border-2 border-gray-600"
              alt="logo"
            />
            <div>
              <p class="text-md font-bold text-BrandActive">{league.name}</p>
              <p class="text-sm text-BrandDisabled">
                {Object.keys(league.relatedGender)[0]} • {league.teamCount} Teams • Formed:{" "}
                { convertDateToReadable(Number(league.formed))}
              </p>
            </div>
          </div>

          <div class="relative">
            <button
              class="px-3 py-1"
              on:click={(event) => toggleDropdown(league.id, event)}
            >
              <PipsIcon className="w-6" />
            </button>
            {#if dropdownVisible === league.id}
              <div
                class="absolute right-0 mt-2 w-48 bg-BrandDarkGray rounded-lg shadow-lg z-10"
              >
                <button
                  class="block w-full px-4 py-2 text-left text-BrandActive hover:bg-BrandLightGray"
                  on:click={() => viewLeague(league.id)}
                >
                  View Details
                </button>
                <button
                  class="block w-full px-4 py-2 text-left text-BrandActive hover:bg-BrandLightGray"
                  on:click={() => updateLeague(league.id)}
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
</Layout>

{#if showAddLeague}
<AddLeagueModal visible={showAddLeague} {closeModal} />
{/if}
