<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  import { clubStore } from "$lib/stores/club-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { Club, FootballLeagueDTO } from "../../../../../declarations/data_canister/data_canister.did";

  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import CreateClub from "../governance/club/create-club.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
  
  export let leagueId: number;

  let isLoading = true;

  let league: FootballLeagueDTO | undefined;
  let clubs: Club[] = [];
  let dropdownVisible: number | null = null;
  
  let showAddClub = false;
  
  onMount(async () => {
    try {
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
    } catch (error) {
      console.error("Error fetching league clubs:", error);
    } finally {
      isLoading = false;
    }
  });

  onMount(() => {
      document.addEventListener('click', handleClickOutside);

      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  function toggleDropdown(playerId: number, event: MouseEvent) {
      event.stopPropagation();
      dropdownVisible = dropdownVisible === playerId ? null : playerId;
  }

  function handleClickOutside(event: MouseEvent) {
      const dropdownElements = document.querySelectorAll('.dropdown-menu');
      const targetElement = event.target as HTMLElement;

      if (![...dropdownElements].some(dropdown => dropdown.contains(targetElement))) {
          dropdownVisible = null;
      }
  }

  async function closeModal(){
    showAddClub = false;
  }

  function viewClub(clubId: number) {
    goto(`/club?id=${clubId}&leagueId=${leagueId}`);
  } 
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  <div class="flex w-full">
    <div class="flex flex-col w-full mb-2 shadow-lg">
      {#if league}
        <div class="flex items-center justify-between w-full mb-2">
            <p class="px-4 md:px-2">{league.name} Clubs</p>
          <button 
            class="mr-4 md:mr-0 brand-button"
            on:click={() => { showAddClub = true; }}>
            + New Club
          </button>
        </div>
      {/if}

      <div class="flex flex-col w-full px-4 mt-2 mb-4 space-y-4 md:mb-0 md:px-0">
        {#each clubs.sort( (a, b) => a.friendlyName.localeCompare(b.friendlyName)) as club}
          <div class="flex items-center justify-between px-3 py-4 border rounded-lg shadow bg-BrandGray border-BrandPurple/50">
            <div class="flex items-center w-full space-x-4">
              <BadgeIcon
                primaryColour={club.primaryColourHex}
                secondaryColour={club.secondaryColourHex}
                thirdColour={club.thirdColourHex}
                className="w-8"
              />
              <div class="flex flex-col flex-grow">
                <p class="text-lg md:text-sm">{club.friendlyName}</p>
                <p class="text-xs">ID: {club.id}</p>
              </div>
              
              <div class="relative">
                <button on:click={(event) => toggleDropdown(club.id, event)}>
                  <PipsIcon className="w-6" />
                </button>
                {#if dropdownVisible === club.id}
                  <div class="absolute right-0 z-10 w-48 mt-2 rounded-md shadow-lg bg-BrandGray">
                    <button class="dropdown-link" on:click={() => viewClub(club.id)}>View Details</button>
                  </div>
                {/if}
              </div>
            </div>
          </div>  
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if showAddClub}
  <CreateClub visible={showAddClub} {closeModal} selectedLeagueId={leagueId} />
{/if}
