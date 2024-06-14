<script lang="ts">
    import AdminEuro2024Entries from "$lib/components/admin/admin_euro2024_entries.svelte";
    import AdminEuro2024Events from "$lib/components/admin/admin_euro2024_events.svelte";
    import { adminStore } from "$lib/stores/admin.store";
    import { onMount } from "svelte";
    import Layout from "../Layout.svelte";
    import { authStore } from "$lib/stores/auth.store";
    import { goto } from "$app/navigation";

    let activeTab: string = "euro2024entries";
    onMount(async () => {
      await authStore.sync();
      authStore.subscribe((store) => {
        if(store.identity == null || store.identity == undefined){
          goto('/');
        }
      });
    });

    function setActiveTab(tab: string): void {
        activeTab = tab;
    }

    async function closeEuro2024Entries(){
      adminStore.closeEuro2024Entries();
    }

    async function openEuro2024Entries(){
      adminStore.openEuro2024Entries();
    }

    async function completeEuro2024Competition(){
      adminStore.completeEuro2024Competition();
    }

    async function recalculateLeaderboard(){
      adminStore.recalculateLeaderboard();
    }

    
</script>
<Layout>

    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
      <p class="text-2xl p-8">Admin</p>
      
      <div class="bg-panel rounded-md p-2">
        <ul
          class="flex bg-light-gray contained-text border-b border-gray-700"
        >
          <li
            class={`mr-1 md:mr-4 ${activeTab === "euro2024entries" ? "active-tab" : ""}`}
          >
            <button
              class={`p-2 ${
                activeTab === "euro2024entries" ? "text-white" : "text-gray-400"
              }`}
              on:click={() => setActiveTab("euro2024entries")}
            >
              Euro 2024 Entries
            </button>
          </li>
          <li
            class={`mr-1 md:mr-4 ${activeTab === "euro2024events" ? "active-tab" : ""}`}
          >
            <button
              class={`p-2 ${
                activeTab === "euro2024events" ? "text-white" : "text-gray-400"
              }`}
              on:click={() => setActiveTab("euro2024events")}
            >
              Euro 2024 Events
            </button>
          </li>
        </ul>
        <div class="flex w-100 bg-OPENFPL p-4 my-4">
          <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" on:click={closeEuro2024Entries}>Close Euro 2024 Entries</button>
          <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" on:click={openEuro2024Entries}>Open Euro 2024 Entries</button>
          <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" on:click={completeEuro2024Competition}>Complete Euro 2024 Competition</button>
          <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" on:click={recalculateLeaderboard}>Recalculate Leaderboard</button>
        </div>
        {#if activeTab === "euro2024entries"}
          <AdminEuro2024Entries />
        {:else if activeTab === "euro2024events"}
          <AdminEuro2024Events />
        {/if}
      </div>
    </div>
</Layout>