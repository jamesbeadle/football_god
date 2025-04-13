<script lang="ts">
    import { onMount } from "svelte";
    import type { ClubValueLeaderboard, PlayerValueLeaderboard } from "../../../../../declarations/backend/backend.did";
    import { playerStore } from "$lib/stores/player-store";
    import { clubStore } from "$lib/stores/club-store";
    import LocalSpinner from "../shared/local-spinner.svelte";
    
    interface HeatmapData {
      id: string;
      data: { value: number; color?: string; label: string }[][];
    }

    let isLoading = $state(true);
    let clubValueLeaderboard: ClubValueLeaderboard | undefined = $state(undefined);
    let playerValueLeaderboard: PlayerValueLeaderboard | undefined = $state(undefined);
    let currentHeatmapIndex = $state(0);
    let heatmaps: HeatmapData[] = $state([]);

    onMount(async () => {
      try {
        await loadPlayerValueLeaderboard();
        await loadClubValueLeaderboard();
        updateHeatmaps();
      } catch (error) {
        console.error("Error loading:", error);
      } finally {
        isLoading = false;
      }
    });
  
    async function loadPlayerValueLeaderboard() {
      try {
        playerValueLeaderboard = await playerStore.getPlayerValueLeaderboard();
      } catch (error) {
        console.error("Error loading player leaderboard:", error);
      }
    }
  
    async function loadClubValueLeaderboard() {
      try {
        clubValueLeaderboard = await clubStore.getClubValueLeaderboard();
      } catch (error) {
        console.error("Error loading club leaderboard:", error);
      }
    }
  
    function updateHeatmaps() {
      const clubData = generateClubHeatmapData();
      const playerData = generatePlayerHeatmapData();
      heatmaps = [
        { id: "Most Valuable Clubs", data: clubData },
        { id: "Most Valuable Players", data: playerData },
      ];
    }
  
    function generateClubHeatmapData(): { value: number; color?: string; label: string }[][] {
      if (!clubValueLeaderboard?.clubs?.length) {
        return Array(5)
          .fill(0)
          .map(() => Array(5).fill({ value: 0, label: "" }));
      }
  
      const clubs = clubValueLeaderboard.clubs.slice(0, 25); 
      const maxValue = Math.max(...clubs.map((club) => club.totalValue));
      const grid = Array(5)
        .fill(0)
        .map(() => Array(5).fill({ value: 0, label: "" }));
  
      let index = 0;
      for (let i = 0; i < 5 && index < clubs.length; i++) {
        for (let j = 0; j < 5 && index < clubs.length; j++) {
          const club = clubs[index];
          grid[i][j] = {
            value: club.totalValue / maxValue, 
            color: club.primaryColour,
            label: club.clubName,
          };
          index++;
        }
      }
      return grid;
    }
  
    function generatePlayerHeatmapData(): { value: number; color?: string; label: string }[][] {
      if (!playerValueLeaderboard?.players?.length) {
        return Array(5)
          .fill(0)
          .map(() => Array(5).fill({ value: 0, label: "" }));
      }
  
      const players = playerValueLeaderboard.players.slice(0, 25); 
      const maxValue = Math.max(...players.map((player) => player.totalValue));
      const grid = Array(5)
        .fill(0)
        .map(() => Array(5).fill({ value: 0, label: "" }));
  
      let index = 0;
      for (let i = 0; i < 5 && index < players.length; i++) {
        for (let j = 0; j < 5 && index < players.length; j++) {
          const player = players[index];
          const normalizedValue = player.totalValue / maxValue;
          grid[i][j] = {
            value: normalizedValue, 
            color: `rgba(127, 86, 250, ${normalizedValue})`, 
            label: `Player ${player.playerId}`,
          };
          index++;
        }
      }
      return grid;
    }
    

  function cycleHeatmap() {
    currentHeatmapIndex = (currentHeatmapIndex + 1) % heatmaps.length;
  }
</script>

{#if isLoading}
  <LocalSpinner />

{:else}

  <div class="w-full bg-BrandGray rounded shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{heatmaps[currentHeatmapIndex].id}</h2>
          <button
              onclick={cycleHeatmap}
              class="bg-BrandPurpleDark text-white px-4 py-2 rounded hover:bg-BrandPurple transition-colors"
          >
              Next
          </button>
      </div>
      <p>{heatmaps[currentHeatmapIndex].id} Heatmap Coming Soon.</p>
      <!-- DevOps 473 & 474
      <div class="grid grid-cols-5 gap-1">
          {#each heatmaps[currentHeatmapIndex].data as row}
                {#each row as cell}
                    <div
                        class="w-full h-16 rounded flex items-center justify-center text-xs"
                        style="background-color: {cell.color || '#7F56FA'}; transform: scale({Math.max(0.5, cell.value)});"
                        title="{cell.label}: {cell.value.toFixed(2)}"
                    >
                        {cell.label}
                    </div>
                {/each}
          {/each}
      </div>
      -->
  </div>

{/if}
