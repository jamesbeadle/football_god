<script lang="ts">
    import Leagues from "$lib/components/data/leagues.svelte";
    import Players from "$lib/components/data/players.svelte";
    import Clubs from "$lib/components/data/clubs.svelte";
    import TabPanel from "$lib/components/shared/tab-panel.svelte";
    import { page } from "$app/stores";
    
    let activeTab = $state('Players');
    $effect(() => {
      activeTab = $page.params.tab || 'players';
    });

    const tabs = [
      { id: "players", label: "Players" },
      { id: "clubs", label: "Clubs" },
      { id: "leagues", label: "Leagues" }
    ];
    
    function setActiveTab(tab: string): void {
      activeTab = tab;
    }
    
  </script>
  
  <div class="page-panel">

    <TabPanel {activeTab} {setActiveTab} {tabs} />

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