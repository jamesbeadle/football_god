<script lang="ts">
    import Layout from "../Layout.svelte";
  
    import AddInitialFixtures from "$lib/components/governance/fixture/add-initial-fixtures.svelte";
    import RevaluePlayerUp from "$lib/components/governance/player/revalue-player-up.svelte";
    import RevaluePlayerDown from "$lib/components/governance/player/revalue-player-down.svelte";
    import MoveFixture from "$lib/components/governance/fixture/move-fixture.svelte";
    import PostponeFixture from "$lib/components/governance/fixture/postpone-fixture.svelte";
    import RescheduleFixture from "$lib/components/governance/fixture/reschedule-fixture.svelte";
    import LoanPlayer from "$lib/components/governance/player/loan-player.svelte";
    import TransferPlayer from "$lib/components/governance/player/transfer-player.svelte";
    import RecallPlayer from "$lib/components/governance/player/recall-player.svelte";
    import CreatePlayer from "$lib/components/governance/player/create-player.svelte";
    import UpdatePlayer from "$lib/components/governance/player/update-player.svelte";
    import SetPlayerInjury from "$lib/components/governance/player/set-player-injury.svelte";
    import RetirePlayer from "$lib/components/governance/player/retire-player.svelte";
    import UnretirePlayer from "$lib/components/governance/player/unretire-player.svelte";
    import PromoteNewClub from "$lib/components/governance/club/promote-new-club.svelte";
    import UpdateClub from "$lib/components/governance/club/update-club.svelte";
    import UpdateLeague from "$lib/components/governance/league/update-league.svelte";
    import UpdateSystemState from "$lib/components/admin/update-system-state.svelte";
    import SnapshotFantasyTeams from "$lib/components/admin/snapshot-fantasy-teams.svelte";
    import CalculateGameweekScores from "$lib/components/admin/calculate-gameweek-scores.svelte";
    import CalculateLeadearboards from "$lib/components/admin/calculate-leadearboards.svelte";
  
    let showRevaluePlayerUpModal: boolean = false;
    let showRevaluePlayerDownModal: boolean = false;
    let showAddInitialFixturesModal: boolean = false;
    let showMoveFixtureModal: boolean = false;
    let showPostponeFixtureModal: boolean = false;
    let showRescheduleFixtureModal: boolean = false;
    let showLoanPlayerModal: boolean = false;
    let showTransferPlayerModal: boolean = false;
    let showRecallPlayerModal: boolean = false;
    let showCreatePlayerModal: boolean = false;
    let showUpdatePlayerModal: boolean = false;
    let showSetPlayerInjuryModal: boolean = false;
    let showRetirePlayerModal: boolean = false;
    let showUnretirePlayerModal: boolean = false;
    let showPromoteNewClubModal: boolean = false;
    let showUpdateClubModal: boolean = false;
    let showAddFixtureDataModal: boolean = false;
    let showCreateLeagueModal: boolean = false;
    let showUpdateLeagueModal: boolean = false;
    let showUpdateSystemStateModal: boolean = false;
    let showSnapshotManagerTeamsModal: boolean = false;
    let showCalculateGameweekScoresModal: boolean = false;
    let showCalculateLeaderboardsModal: boolean = false;
    
    function displayRevaluePlayerUpModal(): void {
      showRevaluePlayerUpModal = true;
    }
  
    function hideRevaluePlayerUpModal(): void {
      showRevaluePlayerUpModal = false;
    }
  
    function displayRevaluePlayerDownModal(): void {
      showRevaluePlayerDownModal = true;
    }
  
    function hideRevaluePlayerDownModal(): void {
      showRevaluePlayerDownModal = false;
    }
  
    function displayAddInitialFixturesModal(): void {
      showAddInitialFixturesModal = true;
    }
  
    function hideAddInitialFixturesModal(): void {
      showAddInitialFixturesModal = false;
    }
  
    function displayMoveFixtureModal(): void {
      showMoveFixtureModal = true;
    }
  
    function hideMoveFixturesModal(): void {
      showMoveFixtureModal = false;
    }
  
    function displayPostponeFixtureModal(): void {
      showPostponeFixtureModal = true;
    }
  
    function hidePostponeFixturesModal(): void {
      showPostponeFixtureModal = false;
    }
  
    function displayRescheduleFixtureModal(): void {
      showRescheduleFixtureModal = true;
    }
  
    function hideRescehduleFixturesModal(): void {
      showRescheduleFixtureModal = false;
    }
  
    function displayLoanPlayerModal(): void {
      showLoanPlayerModal = true;
    }
  
    function hideLoanPlayerModal(): void {
      showLoanPlayerModal = false;
    }
  
    function displayTransferPlayerModal(): void {
      showTransferPlayerModal = true;
    }
  
    function hideTransferPlayerModal(): void {
      showTransferPlayerModal = false;
    }
  
    function displayRecallPlayerModal(): void {
      showRecallPlayerModal = true;
    }
  
    function hideRecallPlayerModal(): void {
      showRecallPlayerModal = false;
    }
  
    function displayCreatePlayerModal(): void {
      showCreatePlayerModal = true;
    }
  
    function hideCreatePlayerModal(): void {
      showCreatePlayerModal = false;
    }
  
    function displayUpdatePlayerModal(): void {
      showUpdatePlayerModal = true;
    }
  
    function hideUpdatePlayerModal(): void {
      showUpdatePlayerModal = false;
    }
  
    function displaySetPlayerInjuryModal(): void {
      showSetPlayerInjuryModal = true;
    }
  
    function hideSetPlayerInjuryModal(): void {
      showSetPlayerInjuryModal = false;
    }
  
    function displayRetirePlayerModal(): void {
      showRetirePlayerModal = true;
    }
  
    function hideRetirePlayerModal(): void {
      showRetirePlayerModal = false;
    }
  
    function displayUnretirePlayerModal(): void {
      showUnretirePlayerModal = true;
    }
  
    function hideUnretirePlayerModal(): void {
      showUnretirePlayerModal = false;
    }
  
    function displayPromoteNewClubModal(): void {
      showPromoteNewClubModal = true;
    }
  
    function hidePromoteNewClubModal(): void {
      showPromoteNewClubModal = false;
    }
  
    function displayUpdateClubModal(): void {
      showUpdateClubModal = true;
    }
  
    function hideUpdateClubModal(): void {
      showUpdateClubModal = false;
    }
  
    function displayAddFixtureDataModal(): void {
      showAddFixtureDataModal = true;
    }
  
    function hideAddFixtureDataModal(): void {
      showAddFixtureDataModal = false;
    }

    function displayCreateLeagueModal(): void {
      showCreateLeagueModal = true;
    }

    function hideCreateLeagueModal(): void {
      showCreateLeagueModal = false;
    }

    function displayUpdateLeagueModal(): void {
      showUpdateLeagueModal = true;
    }

    function hideUpdateLeagueModal(): void {
      showUpdateLeagueModal = false;
    }

    function displayUpdateSystemState(): void {
      showUpdateSystemStateModal = true;
    }

    function hideUpdateSystemState(): void {
      showUpdateSystemStateModal = false;
    }

    function displaySnapshotManagerTeams(): void {
      showSnapshotManagerTeamsModal = true;
    }
    function hideSnapshotManagerTeams(): void {
      showSnapshotManagerTeamsModal = false;
    }
    function displayCalculateGameweekScores(): void {
      showCalculateGameweekScoresModal = true;
    }
    function hideCalculateGameweekScores(): void {
      showCalculateGameweekScoresModal = false;
    }
    function displayCalculateLeaderboards(): void {
      showCalculateLeaderboardsModal = true;
    }
    function hideCalculateLeaderboards(): void {
      showCalculateLeaderboardsModal = false;
    }

  </script>
  
  <Layout>

    {#if showRevaluePlayerUpModal}
      <RevaluePlayerUp
        visible={showRevaluePlayerUpModal}
        closeModal={hideRevaluePlayerUpModal}
      />
    {/if}

    {#if showRevaluePlayerDownModal}
      <RevaluePlayerDown
        visible={showRevaluePlayerDownModal}
        closeModal={hideRevaluePlayerDownModal}
      />
    {/if}
    <!--
    <AddInitialFixtures
      visible={showAddInitialFixturesModal}
      closeModal={hideAddInitialFixturesModal}
    />
    -->

    {#if showMoveFixtureModal}
      <MoveFixture
        visible={showMoveFixtureModal}
        closeModal={hideMoveFixturesModal}
      />
    {/if}

    {#if showPostponeFixtureModal}
      <PostponeFixture
        visible={showPostponeFixtureModal}
        closeModal={hidePostponeFixturesModal}
      />
    {/if}

    {#if showRescheduleFixtureModal}
      <RescheduleFixture
        visible={showRescheduleFixtureModal}
        closeModal={hideRescehduleFixturesModal}
      />
    {/if}

    {#if showLoanPlayerModal}
      <LoanPlayer visible={showLoanPlayerModal} closeModal={hideLoanPlayerModal} />
    {/if}

    {#if showTransferPlayerModal}
      <TransferPlayer
        visible={showTransferPlayerModal}
        closeModal={hideTransferPlayerModal}
      />
    {/if}

    {#if showRecallPlayerModal}
      <RecallPlayer
        visible={showRecallPlayerModal}
        closeModal={hideRecallPlayerModal}
      />
    {/if}

    {#if showCreatePlayerModal}
      <CreatePlayer
        visible={showCreatePlayerModal}
        closeModal={hideCreatePlayerModal}
      />
    {/if}

    {#if showUpdatePlayerModal}
      <UpdatePlayer
        visible={showUpdatePlayerModal}
        closeModal={hideUpdatePlayerModal}
      />
    {/if}

    {#if showSetPlayerInjuryModal}
      <SetPlayerInjury
        visible={showSetPlayerInjuryModal}
        closeModal={hideSetPlayerInjuryModal}
      />
    {/if}

    {#if showRetirePlayerModal}
      <RetirePlayer
        visible={showRetirePlayerModal}
        closeModal={hideRetirePlayerModal}
      />
    {/if}

    {#if showUnretirePlayerModal}
      <UnretirePlayer
        visible={showUnretirePlayerModal}
        closeModal={hideUnretirePlayerModal}
      />
    {/if}

    {#if showPromoteNewClubModal}
      <PromoteNewClub
        visible={showPromoteNewClubModal}
        closeModal={hidePromoteNewClubModal}
      />
    {/if}

    {#if showUpdateClubModal}
      <UpdateClub visible={showUpdateClubModal} closeModal={hideUpdateClubModal} />
    {/if}

    {#if showUpdateLeagueModal}
      <UpdateLeague visible={showUpdateLeagueModal} closeModal={hideUpdateLeagueModal} />
    {/if}

    {#if showUpdateSystemStateModal}
      <UpdateSystemState visible={showUpdateSystemStateModal} closeModal={hideUpdateSystemState} />
    {/if}

    {#if showSnapshotManagerTeamsModal}
      <SnapshotFantasyTeams visible={showSnapshotManagerTeamsModal} closeModal={hideSnapshotManagerTeams} />
    {/if}

    {#if showCalculateGameweekScoresModal}
      <CalculateGameweekScores visible={showCalculateGameweekScoresModal} closeModal={hideCalculateGameweekScores} />
    {/if}

    {#if showCalculateLeaderboardsModal}
      <CalculateLeadearboards visible={showCalculateLeaderboardsModal} closeModal={hideCalculateLeaderboards} />
    {/if}

    <div class="m-4">
      <div class="bg-panel rounded-md">
        <ul
          class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2"
        >
          <li class="mr-4 active-tab">
            <button class="text-white">Raise Proposal</button>
          </li>
        </ul>
  
        <p class="m-4">Application Triggers</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4">
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displayUpdateSystemState}>Update System State</button
              >
            </div>
          </div>
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displaySnapshotManagerTeams}>Snapshot Manager Teams</button
              >
            </div>
          </div>
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displayCalculateGameweekScores}>Calculate Gameweek Scores</button
              >
            </div>
          </div>
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displayCalculateLeaderboards}>Calculate Leaderboards</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  