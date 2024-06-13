<script lang="ts">
    import { onMount } from "svelte";
    import { writable, derived } from "svelte/store";
    import { Spinner } from "@dfinity/gix-components";
    import Layout from "../Layout.svelte";
    type Player = {
  id: number;
    firstName: string;
    lastName: string;
    shirtNumber: number;
    value: number;
    ytdEarnings: number;
    contractType: number; // 1 to 5
    };
  
    const players = writable<Player[]>([]);
    const contractTypeFilter = writable<number | null>(1); // Default to the first tab
    const currentPage = writable<number>(1);
    const itemsPerPage = 10;
  
    const filteredPlayers = derived(
      [players, contractTypeFilter],
      ([$players, $contractTypeFilter]) => {
        return $players
          .filter((player) => $contractTypeFilter === null || player.contractType === $contractTypeFilter)
          .sort((a, b) => b.value - a.value);
      }
    );
  
    const paginatedPlayers = derived(
      [filteredPlayers, currentPage],
      ([$filteredPlayers, $currentPage]) => {
        const start = ($currentPage - 1) * itemsPerPage;
        return $filteredPlayers.slice(start, start + itemsPerPage);
      }
    );
  
    onMount(async () => {
      const response = await fetch('/api/players'); // Replace with your API endpoint
      const data: Player[] = await response.json();
      players.set(data);
    });
  
    function setPage(page: number) {
      currentPage.set(page);
    }
  
    function setContractTypeFilter(type: number) {
      contractTypeFilter.set(type);
      currentPage.set(1); // Reset to the first page
    }
  </script>
  
  <style>
    .tab-active {
      @apply bg-blue-500 text-white;
    }
  </style>
  <Layout>

    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Contracts Center</h1>
      
        <div class="tabs mb-4 flex space-x-2">
          {#each [1, 2, 3, 4, 5] as type}
            <button
              class="px-4 py-2 rounded-lg"
              class:tab-active={$contractTypeFilter === type}
              on:click={() => setContractTypeFilter(type)}
            >
              Contract Type {type}
            </button>
          {/each}
        </div>
      
        {#if $filteredPlayers.length === 0}
          <Spinner />
        {:else}
          <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <thead class=" text-white">
              <tr>
                <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm">First Name</th>
                <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Last Name</th>
                <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Shirt Number</th>
                <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm">Value</th>
                <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm">YTD Earnings</th>
              </tr>
            </thead>
            <tbody class="">
              {#each $paginatedPlayers as player}
                <tr>
                  <td class="w-1/6 py-3 px-4">{player.firstName}</td>
                  <td class="w-1/6 py-3 px-4">{player.lastName}</td>
                  <td class="w-1/6 py-3 px-4">{player.shirtNumber}</td>
                  <td class="w-1/6 py-3 px-4">{player.value}</td>
                  <td class="w-1/6 py-3 px-4">{player.ytdEarnings}</td>
                </tr>
              {/each}
            </tbody>
          </table>
      
          <div class="mt-4 flex justify-center space-x-2">
            {#each Array(Math.ceil($filteredPlayers.length / itemsPerPage)).fill(0) as _, index}
              <button
                class="px-3 py-1 rounded-full"
                class:bg-blue-500={index + 1 === $currentPage}
                class:text-white={index + 1 === $currentPage}
                on:click={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            {/each}
          </div>
        {/if}
      </div>
  </Layout>
  