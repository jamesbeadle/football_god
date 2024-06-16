<script lang="ts">
    import { onMount } from "svelte";
    import Layout from "../Layout.svelte";
    import { Spinner } from "@dfinity/gix-components";
    import { euro2024Store } from "$lib/stores/euro2024.store";
    import type { Euro2024LeaderboardEntryDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
    let isLoading = true;
    let limit = 10n;
    let offset = 0n;
    let totalEntries = 0n;
    let entries: Euro2024LeaderboardEntryDTO[] = [];
    let currentPage = 1;
    
    const fetchLeaderboard = async () => {
        isLoading = true;
        try {
            await euro2024Store.sync();
            let result = await euro2024Store.getLeaderboard(offset, limit);
            
            const uniqueEntries = filterUniqueEntries(result.leaderboardEntries);
            entries = uniqueEntries;

            totalEntries = result.totalEntries;
        } catch {
            console.error("Error fetching leaderboard");
        } finally {
        isLoading = false;
        }
    };

    const filterUniqueEntries = (entries: Euro2024LeaderboardEntryDTO[]) => {
        const seen = new Set();
        return entries.filter(entry => {
            if (seen.has(entry.principalName)) {
                return false;
            } else {
                seen.add(entry.principalName);
                return true;
            }
        });
    };

    
    onMount(fetchLeaderboard);

    function goToPage(page: number): void {
        currentPage = page;
        offset = (BigInt(page) - 1n) * limit;
        fetchLeaderboard();
    }

    
  </script>
  
  <Layout>
    <div class="bg-panel mt-4">
        <h1 class="p-4 mx-1 default-header">Euro 2024 Leaderboard</h1>
        
        <div class="flex flex-row p-4">
            <div class="w-1/6">
                <p>Pos</p>
            </div>
            <div class="w-3/6">
                <p>Username</p>
            </div>
            <div class="w-1/6">
                <p>Points</p>
            </div>
            <div class="w-1/6">
                <p>View</p>
            </div>
        </div>
        {#if isLoading}
            <Spinner />
        {:else}
            {#each entries as entry}
                <div class="flex flex-row p-4">
                    <div class="w-1/6">
                        <p>{entry.position}</p>
                    </div>
                    <div class="w-3/6">
                        <p>{entry.displayName == entry.principalName ? 'Unset' : entry.displayName}</p>
                    </div>
                    <div class="w-1/6">
                        <p>{entry.totalScore}</p>
                    </div>
                    <div class="w-1/6">
                        
                        <a href={`/prediction?id=${entry.principalName}`}>
                            <button class="bg-OPENFPL px-4 py-2">View</button>
                        </a>
                    </div>
                </div>
            {/each}

            <div class="flex justify-center py-4 mt-4">
                {#each Array(Math.ceil(Number(totalEntries) / Number(limit))) as _, i}
                    <button 
                        class={`mx-1 px-2 py-1 ${currentPage === i + 1 ? 'bg-OPENFPL' : 'bg-gray-500'}`} 
                        on:click={() => goToPage(i + 1)}>
                        {i + 1}
                    </button>
                {/each}
            </div>

          
        {/if}
    </div>
  </Layout>
  