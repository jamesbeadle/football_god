<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import { clubStore } from "$lib/stores/club-store";
    
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import TeamPlayers from "$lib/components/club/team-players.svelte";
    import TeamFixtures from "$lib/components/club/team-fixtures.svelte";
    import TabContainer from "$lib/components/shared/tab-container.svelte";
    import ClubHeader from "$lib/components/club/club-header.svelte";
    import type { LeagueId, ClubId, Club } from "../../../../declarations/backend/backend.did";
  
    let isLoading = true;
    let club: Club | null = null;
    
    let activeTab: string = "players";
    const tabs = [
      { id: "players", label: "Players" },
      { id: "fixtures", label: "Fixtures" },
    ];
  
    $: clubId = Number($page.url.searchParams.get("id")) as ClubId;
    $: leagueId = Number($page.url.searchParams.get("leagueId")) as LeagueId;
  
    onMount(async () => {
      let clubsResult = await clubStore.getClubs(leagueId);
      if(!clubsResult) throw new Error("Failed to fetch clubs");
      let clubs = clubsResult.clubs;
      club = clubs.find(c => c.id === clubId) || null;
      
      if (!club) {
        console.error(`Club with id ${clubId} not found`);
        goto('/');
        return;
      }
      isLoading = false;
    });
  
    async function setActiveTab(tab: string): Promise<void> {
      activeTab = tab;
    }
  </script>
  
    {#if isLoading || !club}
      <LocalSpinner />
    {:else}
      <ClubHeader {club} />
      <div class="!border !rounded-lg bg-panel !border-BrandPurple/50">
        <div class="flex py-4 border-b md:px-4 border-gray-700">
          <TabContainer filterType={activeTab} {setActiveTab} {tabs} />
        </div>
        {#if activeTab === "players"}
          <TeamPlayers {club} />
        {:else if activeTab === "fixtures"}
          <TeamFixtures {club} {leagueId} />
        {/if}
      </div>
    {/if}
  