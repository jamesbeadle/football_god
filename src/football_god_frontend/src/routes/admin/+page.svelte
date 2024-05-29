<script lang="ts">
    import AdminEuro2024 from "$lib/components/admin/+admin_euro2024.svelte";
    import Layout from "../Layout.svelte";

    let activeTab: string = "euro2024";


    function setActiveTab(tab: string): void {
        activeTab = tab;
    }

    
</script>
<Layout>

    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
        <p class="text-2xl p-8">Admin</p>
        
        
        <div class="bg-panel rounded-md">
        <ul
          class="flex bg-light-gray contained-text border-b border-gray-700"
        >
          <li
            class={`mr-1 md:mr-4 ${activeTab === "euro2024" ? "active-tab" : ""}`}
          >
            <button
              class={`p-2 ${
                activeTab === "euro2024" ? "text-white" : "text-gray-400"
              }`}
              on:click={() => setActiveTab("euro2024")}
            >
              Euro 2024
            </button>
          </li>
          <li
            class={`mr-1 md:mr-4 ${activeTab === "premierLeague" ? "active-tab" : ""}`}
          >
            <button
              class={`p-2 ${
                activeTab === "premierLeague" ? "text-white" : "text-gray-400"
              }`}
              on:click={() => setActiveTab("premierLeague")}
            >
              Premier League
            </button>
          </li>
        </ul>
  
        {#if activeTab === "euro2024"}
          <AdminEuro2024 />
        {/if}
      </div>


    </div>
</Layout>