<script lang="ts">
    export let filterType: string;
    export let setActiveTab: (tabName: string) => Promise<void>;
    export let tabs:  { id: string; label: string }[];

</script>

<div class="flex w-full">
    <ul class="flex w-full px-3 rounded-t-lg">
        {#each tabs as tab}
            <li class={`mr-3 ${filterType === tab.id ? "active-tab" : ""}`}>
                <button 
                    class={`p-2 ${filterType === tab.id ? "text-white" : "text-gray-400"}`}
                    on:click={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            </li>
        {/each}
    </ul>
</div>