<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { clubStore } from "$lib/stores/club-store";

  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import CreateClub from "../governance/club/create-club.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
  import type { ClubValueLeaderboard } from "../../../../../declarations/backend/backend.did";

  let isLoading = true;

  let clubValueLeaderboard: ClubValueLeaderboard | undefined;
  
  onMount(async () => {
    try {
      let leaderboardResult = await clubStore.getClubValueLeaderboard();
      if(!leaderboardResult) throw new Error("Error fetching club value leaderboard.");
      clubValueLeaderboard = leaderboardResult;
    } catch (error) {
      console.error("Error fetching club value leaderboard:", error);
    } finally {
      isLoading = false;
    }
  });

  onMount(() => {
  });

  function viewClub(leagueId: number, clubId: number) {
    goto(`/club?id=${clubId}&leagueId=${leagueId}`);
  } 
</script>

{#if isLoading || !clubValueLeaderboard}
  <LocalSpinner />
{:else}
  <div class="flex w-full">
    <div class="flex flex-col w-full mb-2 shadow-lg">
      <div class="flex flex-col w-full px-4 mt-2 mb-4 space-y-4 md:mb-0 md:px-0">
        {#each clubValueLeaderboard.clubs.sort((a, b) => b.totalValue - a.totalValue) as club}
          <div class="flex flex-col md:flex-row w-full items-center justify-between px-3 py-4 border rounded-lg shadow bg-BrandGray border-BrandPurple/50">
            <div class="flex flex-col md:flex-row w-full items-center w-full space-x-4">
              <div class="flex w-full flex-col md:w-3/4">

                <div class="flex flex-row items-center">
                  <p class="text-xs mr-2">ID: {club.clubId}</p>
                  <BadgeIcon
                    primaryColour={club.primaryColour}
                    secondaryColour={club.secondaryColour}
                    thirdColour={club.thirdColour}
                    className="w-8"
                  />
                  <p class="text-lg md:text-sm ml-2">{club.clubName}</p>
                  <!--<p>{club.gender}</p>-->
                </div>

                
              </div>
              <div class="flex w-full md:w-1/4">
                <!-- B -->
                <p class="text-xs">Value: £{(club.totalValue / 4).toFixed(2)}m</p>
              </div>
            </div>
            <div class="flex flex-col md:flex-row w-full items-center w-full space-x-4">
              <div class="flex w-full md:w-3/4">
                <div class="flex flex-col">
                  <div class="flex w-full">
                    <!-- C -->
                     <div class="flex h-12 bg-red-500 w-full"></div>
                  </div>
                  <div class="flex w-full">
                    <!-- D -->
                     <div class="flex h-12 bg-blue-500 w-full"></div>
                  </div>
                </div>
              </div>
              <div class="flex w-full md:w-1/4">
                <div class="flex flex-col">
                  <div class="flex w-full">
                    <!-- E -->
                     <div class="flex h-12 bg-green-500 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}