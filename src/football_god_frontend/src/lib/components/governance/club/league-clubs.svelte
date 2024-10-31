<script lang="ts">
  import { onMount } from "svelte";
  import { toastsError } from "$lib/stores/toasts-store";
  import { clubStore } from "$lib/stores/club-store";
  import { userStore } from "$lib/stores/user-store";
  import { leagueStore } from "$lib/stores/league-store";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import type { ClubDTO, FootballLeagueDTO } from "../../../../../../declarations/football_god_backend/football_god_backend.did";
    import CreateClub from "./create-club.svelte";

  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let showAddClub = false;
  let isDataManager = false;

  onMount(async () => {
    try {
      isDataManager = await userStore.isDataManager();
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching league clubs." },
        err: error,
      });
      console.error("Error fetching league clubs:", error);
    } finally {
    }
  });

  async function closeModal(){
    showAddClub = false;
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
    {#each clubs.sort( (a, b) => a.friendlyName.localeCompare(b.friendlyName)) as team}
      <div class="flex flex-row items-center bg-gray-700 rounded shadow p-4 w-full my-2">
        <div class="flex items-center space-x-4 w-full">
          <BadgeIcon
            primaryColour={team.primaryColourHex}
            secondaryColour={team.secondaryColourHex}
            thirdColour={team.thirdColourHex}
            className="w-8"
          />
          <p class="flex-grow text-lg md:text-sm">{team.friendlyName}</p>
          <a class="mt-auto self-end" href={`/club?id=${team.id}`}>
            <button class="brand-button text-white font-bold py-2 px-4 rounded">
              View
            </button>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
</div>

{#if showAddClub}
<CreateClub visible={showAddClub} {closeModal} selectedLeagueId={leagueId} />
{/if}
