<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { leagueStore } from "$lib/stores/league-store";
    import { seasonStore } from "$lib/stores/season-store";
    import { fixtureStore } from "$lib/stores/fixture-store";
    import { clubStore } from "$lib/stores/club-store";
    import { playerStore } from "$lib/stores/player-store";
    import type { Club, Fixture, Player, LeagueStatus } from "../../../../../declarations/data_canister/data_canister.did";
    import type { FixtureWithClubs } from "$lib/types/fixture-with-clubs";
    import HeaderContentPanel from "../../components/shared/panels/header-content-panel.svelte";
    import HeaderFixturePanel from "../../components/shared/panels/header-fixture-panel.svelte";
    import { getFixturesWithTeams, updateTableData } from "$lib/utils/helpers";
    import ClubBrandPanel from "./club-brand-panel.svelte";
    import PageHeader from "../shared/panels/page-header.svelte";
    import ContentPanel from "../shared/panels/content-panel.svelte";
    import LocalSpinner from "../shared/local-spinner.svelte";
    import { page } from '$app/stores';
    
    export let club: Club;
    
    let leagueId = Number($page.url.searchParams.get('leagueId')) || 1; 
  
    let isLoading = true;
    let nextFixture: Fixture | null;
    let nextFixtureHomeTeam: Club | undefined;
    let nextFixtureAwayTeam: Club | undefined;
    let clubFixturesWithTeams: FixtureWithClubs[] = [];
    let fixturesWithTeams: FixtureWithClubs[] = [];
    let selectedGameweek = writable(1);
    let tableData: any[] = [];
    let highestScoringPlayer: Player | null = null;
    let seasonName = "";
    let leagueStatus: LeagueStatus | null = null;
    let players: Player[] = [];
    let clubs: Club[] = [];
    let fixtures: Fixture[] = [];
    
    $: if (fixturesWithTeams.length > 0 && clubs.length > 0) {
      tableData = updateTableData(fixturesWithTeams, clubs, $selectedGameweek);
    }
  
    onMount(async () => {
      let leagueStatusResult = await leagueStore.getLeagueStatus(id);
        if(!leagueStatusResult) throw new Error("Failed to fetch league status");
        leagueStatus = leagueStatusResult;
        const seasons = await seasonStore.getSeasons(leagueId);
        seasonName = seasons.find(x => x.id == leagueStatus?.activeSeasonId)?.name ?? "";
        $selectedGameweek = leagueStatus?.activeGameweek == 0 
            ? leagueStatus?.unplayedGameweek 
            : leagueStatus?.activeGameweek ?? 1;

            let fixturesResult = await fixtureStore.getFixtures(leagueId, leagueStatus?.activeSeasonId ?? 1);
            if(!fixturesResult) throw new Error("Failed to fetch fixtures");
            let fixtures = fixturesResult.fixtures;

            let clubsResult = await clubStore.getClubs(leagueId);
            if(!clubsResult) throw new Error("Failed to fetch fixtures");
            clubs = clubsResult.clubs;

        let teamFixtures = fixtures.filter((x) => x.homeClubId === club.id || x.awayClubId === club.id);
        fixturesWithTeams = getFixturesWithTeams(clubs, fixtures);

        let playersResult = await playerStore.getPlayers(leagueId);
        if(!playersResult) throw new Error("Failed to fetch players");
        players = playersResult.players;
        highestScoringPlayer = players.filter(x => x.clubId == club.id)
          .sort((a, b) => Number(b.valueQuarterMillions) - Number(a.valueQuarterMillions))[0];
  
        nextFixture = teamFixtures.find((x) => x.gameweek === $selectedGameweek) ?? null;
        nextFixtureHomeTeam = clubs.find((team) => team.id === nextFixture?.homeClubId);
        nextFixtureAwayTeam = clubs.find((team) => team.id === nextFixture?.awayClubId);

        isLoading = false;
    });
  
    const getTeamPosition = (teamId: number) => {
        const position = tableData.findIndex((team) => team.id === teamId);
        return position !== -1 ? position + 1 : "-";
    };
  
    const getTeamPoints = (teamId: number) => {
        if (!tableData || tableData.length == 0) { return 0; }
        const points = tableData.find((team) => team.id === teamId).points;
        return points;
    };
  </script>
  
  <PageHeader>
    {#if isLoading}
      <LocalSpinner />
    {:else}
      <div class="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
        <ContentPanel>
          <ClubBrandPanel {club} />
          <div class="vertical-divider"></div>
          <HeaderContentPanel header="League Points" content={getTeamPoints(club.id).toString()} footer="Total" loading={false} />
          <div class="vertical-divider"></div>
          <HeaderContentPanel header="League Position" content={getTeamPosition(club.id).toString()} footer={seasonName} loading={false} />
        </ContentPanel>
        <ContentPanel>
          <HeaderFixturePanel header="Next Game" {nextFixtureAwayTeam} {nextFixtureHomeTeam} />
          <div class="vertical-divider"></div>
          <HeaderContentPanel 
            header="Most Valuable Player" 
            content={`${highestScoringPlayer?.lastName ?? "-"} £${((highestScoringPlayer?.valueQuarterMillions ?? 0) / 4).toFixed(2)}m`} 
            footer={Object.keys(highestScoringPlayer?.position ?? { Goalkeeper: null })[0].toString()} 
            loading={false} 
          />
        </ContentPanel>
      </div>
    {/if}
  </PageHeader>