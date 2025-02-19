<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import type { ClubId, LeagueId, ClubDTO } from "../../../../declarations/data_canister/data_canister.did";
    import { goto } from "$app/navigation";

    import { clubStore } from "$lib/stores/club-store";
    
    import Layout from "../Layout.svelte";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import TeamPlayers from "$lib/components/club/team-players.svelte";
    import TeamFixtures from "$lib/components/club/team-fixtures.svelte";
    import TabContainer from "$lib/components/shared/tab-container.svelte";
    import ClubHeader from "$lib/components/club/club-header.svelte";
  
    let isLoading = true;
    let club: ClubDTO | null = null;
    
    let activeTab: string = "players";
    const tabs = [
      { id: "players", label: "Players" },
      { id: "fixtures", label: "Fixtures" },
    ];
  
    $: clubId = Number($page.url.searchParams.get("id")) as ClubId;
    $: leagueId = Number($page.url.searchParams.get("leagueId")) as LeagueId;
  
    onMount(async () => {
      const clubs = await clubStore.getClubs(leagueId);
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
  
  <Layout>
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
  </Layout>
  