<script lang="ts">
    import Layout from "../+layout.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    
    let isLoading = true;
    let activeTab: string = "players";
    
    function setActiveTab(tab: string): void {
      activeTab = tab;
    }
    
  </script>
  
  <Layout>
    {#if isLoading}
      <FullScreenSpinner />
    {:else}
    <div class="m-4">
      <div class="bg-panel rounded-md">
        <ul
          class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2"
        >
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
      </div>
    </div>
    {/if}
  </Layout>