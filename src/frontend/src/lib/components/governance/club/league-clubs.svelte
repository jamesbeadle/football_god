<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { clubStore } from "$lib/stores/club-store";
  import { userStore } from "$lib/stores/user-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { ClubDTO, FootballLeagueDTO } from "../../../../../../declarations/backend/backend.did";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import CreateClub from "./create-club.svelte";
  import RemoveClub from "./remove-club.svelte";

  export let leagueId: number;

  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let selectedClubId = 0;
  let isDataManager = false;
  let dropdownVisible: number | null = null;
  
  let showAddClub = false;
  let showRemoveClub = false;
  
  onMount(async () => {
    try {
      isDataManager = await userStore.isDataManager();
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
    } catch (error) {
      console.error("Error fetching league clubs:", error);
    } finally {
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

  function loadRemoveClub(clubId: number){
      selectedClubId = clubId;
      showRemoveClub = true;
  }

  async function closeModal(){
    showAddClub = false;
    showRemoveClub = false;
  }
</script>

<div class="page-header-wrapper flex w-full">
  <div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
    <div class="flex justify-between items-center w-full mb-4">
      {#if league}
        <p class="text-2xl font-bold text-white">{league.name} Clubs</p>
      {/if}
      {#if isDataManager}
        <button 
          class="brand-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          on:click={() => { showAddClub = true; }}>
          + New Club
        </button>
      {/if}
    </div>

    <div>
      {#each clubs.sort( (a, b) => a.friendlyName.localeCompare(b.friendlyName)) as club}
        <div class="flex flex-row items-center bg-gray-800 rounded-lg shadow p-4 w-full my-2 transition hover:bg-gray-700">
          <div class="flex items-center space-x-4 w-full">
            <BadgeIcon
              primaryColour={club.primaryColourHex}
              secondaryColour={club.secondaryColourHex}
              thirdColour={club.thirdColourHex}
              className="w-8"
            />
            <p class="flex-grow text-lg md:text-sm">{club.friendlyName}</p>
            
            <div class="relative">
              <button class="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg" on:click={(event) => toggleDropdown(club.id, event)}>Actions</button>
              {#if dropdownVisible === club.id}
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 text-sm dropdown-menu">
                  <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadRemoveClub(club.id)}>Remove Club</button>
                </div>
              {/if}
            </div>
          </div>
        </div>  
      {/each}
    </div>
  </div>
</div>

{#if showAddClub}
  <CreateClub visible={showAddClub} {closeModal} selectedLeagueId={leagueId} />
{/if}

{#if showRemoveClub}
  <RemoveClub visible={showRemoveClub} {closeModal} selectedLeagueId={leagueId} {selectedClubId} />
{/if}
