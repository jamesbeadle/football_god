<script lang="ts">
    import Layout from "../Layout.svelte";  
    import UpdateSystemState from "$lib/components/admin/update-system-state.svelte";
    import SnapshotFantasyTeams from "$lib/components/admin/snapshot-fantasy-teams.svelte";
    import CalculateGameweekScores from "$lib/components/admin/calculate-gameweek-scores.svelte";
    import CalculateLeadearboards from "$lib/components/admin/calculate-leadearboards.svelte";
    import CalculateWeeklyRewards from "$lib/components/admin/calculate-weekly-rewards.svelte";
    import PayWeeklyRewards from "$lib/components/admin/pay-weekly-rewards.svelte";
    
    let showUpdateSystemStateModal: boolean = false;
    let showSnapshotManagerTeamsModal: boolean = false;
    let showCalculateGameweekScoresModal: boolean = false;
    let showCalculateLeaderboardsModal: boolean = false;
    let showCalculateWeeklyRewardsModal: boolean = false;
    let showPayWeeklyRewardsModal: boolean = false;
      
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

    function displayCalculateWeeklyRewards(): void {
      showCalculateWeeklyRewardsModal = true;
    }

    function hideCalculateWeeklyRewards(): void {
      showCalculateWeeklyRewardsModal = false;
    }

    function displayPayWeeklyRewards(): void {
      showPayWeeklyRewardsModal = true;
    }

    function hidePayWeeklyRewards(): void {
      showPayWeeklyRewardsModal = false;
    }

  </script>
  
  <Layout>

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

    {#if showCalculateWeeklyRewardsModal}
      <CalculateWeeklyRewards visible={showCalculateWeeklyRewardsModal} closeModal={hideCalculateWeeklyRewards} />
    {/if}

    {#if showPayWeeklyRewardsModal}
      <PayWeeklyRewards visible={showPayWeeklyRewardsModal} closeModal={hidePayWeeklyRewards} />
    {/if}

    <div class="m-4">
      <div class="bg-panel rounded-md">
          
        <p class="p-4">Application Triggers</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4">
          <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full">
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
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displayCalculateWeeklyRewards}>Calculate Weekly Rewards</button
              >
            </div>
          </div>
          <div
            class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"
          >
            <div class="flex items-center space-x-4 w-full">
              <button
                class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full"
                on:click={displayPayWeeklyRewards}>Pay weekly rewards</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  