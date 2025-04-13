<script lang="ts">
    import Leagues from "$lib/components/data/leagues.svelte";
    import Players from "$lib/components/data/players.svelte";
    import Clubs from "$lib/components/data/clubs.svelte";
    
    let activeTab: string = "players";
    
    function setActiveTab(tab: string): void {
      activeTab = tab;
    }
    
  </script>
    
  <div class="m-4">
    <div class="page-panel">
      <ul class="tab-container">
        <li class={`mr-4 ${activeTab === "players" ? "active-tab" : ""}`}>
          <button
            class={`p-2 ${
              activeTab === "players" ? "text-white" : "BrandGray"
            }`}
            on:click={() => setActiveTab("players")}>Players</button
          >
        </li>
        <li class={`mr-4 ${activeTab === "clubs" ? "active-tab" : ""}`}>
          <button
            class={`p-2 ${
              activeTab === "clubs" ? "text-white" : "BrandGray"
            }`}
            on:click={() => setActiveTab("clubs")}>Clubs</button
          >
        </li>
        <li class={`mr-4 ${activeTab === "leagues" ? "active-tab" : ""}`}>
          <button
            class={`p-2 ${
              activeTab === "leagues" ? "text-white" : "BrandGray"
            }`}
            on:click={() => setActiveTab("leagues")}>Leagues</button
          >
        </li>
      </ul>

      <div class="flex w-full flex-col p-4">

        {#if activeTab == 'players'}
          <Players />
        {/if}
  
        {#if activeTab == 'clubs'}
          <Clubs />
        {/if}
  
        {#if activeTab == 'leagues'}
          <Leagues />
        {/if}

      </div>

    </div>
  </div>