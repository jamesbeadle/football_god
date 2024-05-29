<script lang="ts">
    import { adminStore } from "$lib/stores/admin.store";
    import { formatUnixDateToReadable } from "$lib/utils/helpers";
    import { onMount } from "svelte";
    import type { Euro2024PredictionDTO } from "../../../../../declarations/football_god_backend/football_god_backend.did";

    let currentPage = 1;
    const pageSize = 10;

    let entries: Euro2024PredictionDTO[] = [];

    onMount(async () => {
        entries = await adminStore.getEuro2024Entries(currentPage, pageSize);
        console.log(entries)
    });

    function goToPage(page: number) {
        currentPage = page;
    }

    async function deleteEntry(principalId: string){
        let result = await adminStore.deleteEuro2024Entry(principalId);
        console.log("delete entry");
        console.log(result);
    };

</script>
<div class="p-4">
    <p>Euro 2024 Entries:</p>

    <div class="overflow-x-auto flex-1">
        <div
          class="flex justify-between border border-gray-700 py-2 bg-light-gray border-b border-gray-700"
        >
          <div class="w-6/12">PrincipalId</div>
          <div class="w-3/12">Entry Date</div>
          <div class="w-3/12"></div>
        </div>
    
        {#each entries as entry, index}
          <div
            class="flex items-center justify-between py-2 border-b border-gray-700 cursor-pointer"
          >
            <div class="w-6/12">
                {entry.principalId}
            </div>
    
            <div class="w-3/12">
              {formatUnixDateToReadable(Number(entry.entryTime))}
            </div>
    
            <div class="w-3/12">
                <button on:click={() => deleteEntry(entry.principalId)}>Delete</button>
            </div>
          </div>
        {/each}
      </div>
</div>

<div class="justify-center mt-4 pb-4 overflow-x-auto">
    <div class="flex space-x-1 min-w-max">
        {#each Array(Math.ceil(entries.length / pageSize)) as _, index}
            <button
                class={`px-4 py-2 rounded-md ${
                    index + 1 === currentPage ? "fpl-button" : ""
                }`}
            on:click={() => goToPage(index + 1)}
            >
            {index + 1}
            </button>
        {/each}
    </div>
</div>
    <!-- List all predictions with delete functionality -->

    <!-- Add euro 2024 data -->

    <!-- Update Euro 2024 Status -->

    <!-- Button to transfer sub account balance amount to default account -->