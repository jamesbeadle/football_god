<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";

  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { playerStore } from "$lib/stores/player-store";
  import { governanceStore } from "$lib/stores/governance-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { convertEvent, isError, replacer } from "$lib/utils/helpers";
  import { toasts } from "$lib/stores/toasts-store";
  
  import Layout from "../+layout.svelte";
  import PlayerEventsModal from "$lib/components/fixture-validation/player-events-modal.svelte";
  import SelectPlayersModal from "$lib/components/fixture-validation/select-players-modal.svelte";
  import ConfirmFixtureDataModal from "$lib/components/fixture-validation/confirm-fixture-data-modal.svelte";
  import ClearDraftModal from "$lib/components/fixture-validation/clear-draft-modal.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import SelectedPlayerList from "$lib/components/fixture-validation/selected-player-list.svelte";
  
  import type { Club, Fixture, Player, PlayerEventData, SubmitFixtureData } from "../../../../declarations/data_canister/data_canister.did";
  
  let clubs: Club[] = [];
  let players: Player[] = [];
  let fixture: Fixture | undefined;
  let selectedTeam: Club | null = null;
  let homeTeam: Club | null;
  let awayTeam: Club | null;

  let activeTab: string = "home";
  let showPlayerSelectionModal = false;
  let showPlayerEventModal = false;
  let showClearDraftModal = false;
  let showConfirmDataModal = false;

  let selectedPlayer: Player | null = null;

  let teamPlayers = writable<Player[]>([]);
  let selectedPlayers = writable<Player[]>([]);
  let playerEventData = writable<PlayerEventData[]>([]);

  let homeGoalsText = 0;
  let awayGoalsText = 0;
  let homeAssistsText = 0;
  let awayAssistsText = 0;
  let gameweek = 0;

  let isLoading = true;
  let submitting = false;
  let submitted = false;

  $: fixtureId = Number($page.url.searchParams.get("id"));
  $: leagueId = Number($page.url.searchParams.get("league-id"));
  $: seasonId = Number($page.url.searchParams.get("season-id"));

  $: isSubmitDisabled =
    $playerEventData.length == 0 ||
    $playerEventData.filter((x) => convertEvent(x.eventType) == 0).length !=
      $selectedPlayers.length;

  $: homeGoalsText = $playerEventData
    .filter(event => 
      "Goal" in event.eventType && 
      event.clubId === fixture?.homeClubId
    ).length;

  $: awayGoalsText = $playerEventData
    .filter(event => 
      "Goal" in event.eventType && 
      event.clubId === fixture?.awayClubId
    ).length;

  $: homeAssistsText = $playerEventData
    .filter(event => 
      "GoalAssisted" in event.eventType && 
      event.clubId === fixture?.homeClubId
    ).length;

  $: awayAssistsText = $playerEventData
    .filter(event => 
      "GoalAssisted" in event.eventType && 
      event.clubId === fixture?.awayClubId
    ).length;

  onMount(async () => {
    try {
      clubs = await clubStore.getClubs(leagueId);      
      players = await playerStore.getPlayers(leagueId);

      let leagueStatus = await leagueStore.getLeagueStatus(leagueId);
      const fixtures = await fixtureStore.getFixtures(leagueId, leagueStatus.activeSeasonId);
      
      if (clubs.length == 0 || players.length == 0 || !fixtures) {
        return;
      }

      fixture = fixtures.find(x => x.id == fixtureId);
      gameweek = fixture?.gameweek ?? 0;
    
      homeTeam = clubs.find((x) => x.id == fixture?.homeClubId)!;
      awayTeam = clubs.find((x) => x.id == fixture?.awayClubId)!;
      selectedTeam = homeTeam;
      teamPlayers.set(players.filter((x) => x.clubId == selectedTeam?.id));
  
      loadDraft(fixtureId);
    } catch (error) {
      console.error("Error fetching fixture information.", error);
    } finally {
      isLoading = false;
    }
  });

  function loadDraft(fixtureId: number) {
    try{
      const draftKey = `fixtureDraft_${fixtureId}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
      const draftData = JSON.parse(savedDraft);

      let selectedPlayersData: Player[] = draftData.selectedPlayers;
      if(selectedPlayersData && selectedPlayersData.length > 0){
        selectedPlayers.set(selectedPlayersData);
      }

      let draftEventData = draftData.playerEventData;
      if (draftEventData) {
        playerEventData.set(draftEventData);
      }

      }
    } catch (error)  {
      console.error("Error setting draft.", error);
        clearDraft();
    }
  }

  async function confirmFixtureData() {
    if(submitted || submitting){
      return;
    }
    try {
      showConfirmDataModal = false;
      submitting = true;
      let dto: SubmitFixtureData = {
        seasonId,
        leagueId,
        fixtureId : fixtureId,
        gameweek,
        playerEventData: $playerEventData
      };
      let result = await governanceStore.submitFixtureData(dto);

      if (isError(result)) {
        submitting = false;
        console.error("Error submitting proposal");
        return;
      }
      submitted = true;
      submitting = false;
      localStorage.removeItem(`fixtureDraft_${fixtureId}`);
      if(submitted){
        toasts.addToast({
          message: `Successfully submitted proposal`,
          type: "success",
          duration: 3000,
        });
      }
      goto(`/`)
    } catch (error) {
      console.error("Error saving fixture data: ", error);
    } finally {
      isLoading = false;
      showConfirmDataModal = false;
    }
  }

  function saveDraft() {
    let uniquePlayers = new Set<Player>();
    $playerEventData.forEach((event) => {
      uniquePlayers.add(players.find(x => x.id == event.playerId)!);
  });


    let allSelectedPlayers = new Set<Player>();
    $selectedPlayers.forEach((player) => {
      allSelectedPlayers.add(player);
    });

    const draftData = {
      allPlayers: Array.from(uniquePlayers),
      playerEventData: $playerEventData,
      selectedPlayers: Array.from(allSelectedPlayers)
    };
    const draftKey = `fixtureDraft_${fixtureId}`;
    localStorage.setItem(draftKey, JSON.stringify(draftData, replacer));
    toasts.addToast({
      message: `Successfully saved draft`,
      type: "success",
      duration: 2000,
    });
  }

  function clearDraft() {
    playerEventData = writable<PlayerEventData[]>([]);
    selectedPlayers = writable<Player[]>([]);
    localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    closeConfirmClearDraftModal();
    toasts.addToast({
      message: `Successfully cleared draft`,
      type: "success",
      duration: 2000,
    });
  }

  async function setActiveTab(tab: string) {
    selectedTeam = tab === "home" ? homeTeam : awayTeam;
    teamPlayers.set(players.filter((x) => x.clubId == selectedTeam?.id));
    activeTab = tab;
  }

  function handleEditPlayerEvents(player: Player) {
    selectedPlayer = player;
    showPlayerEventModal = true;
  }

  function handleRemovePlayer(player: Player) {
    selectedPlayers.set($selectedPlayers.filter((x) => x.id != player.id));
    playerEventData.set($playerEventData.filter(x => x.playerId != player.id))
  }

  function closeEventPlayerEventsModal(): void {
    showPlayerEventModal = false;
  }

  function showSelectPlayersModal(): void {
    showPlayerSelectionModal = true;
  }

  function closeSelectPlayersModal(): void {
    showPlayerSelectionModal = false;
  }

  function showConfirmClearDraftModal(): void {
    showClearDraftModal = true;
  }

  function closeConfirmClearDraftModal(): void {
    showClearDraftModal = false;
  }

  function displayConfirmDataModal(): void {
    showConfirmDataModal = true;
  }

  function closeConfirmDataModal(): void {
    showConfirmDataModal = false;
  }

  function handleModalClosed(): void {
    selectedPlayer = null;
  }

  function calculateHomeScore(events: PlayerEventData[]) {
    if (!homeTeam || !awayTeam) return 0;
    return events.filter(event => {
      const isHomeTeamGoal = event.clubId === homeTeam!.id && "Goal" in event.eventType;
      const isAwayTeamOwnGoal = event.clubId === awayTeam!.id && "OwnGoal" in event.eventType;
      return isHomeTeamGoal || isAwayTeamOwnGoal;
    }).length;
  }

  function calculateAwayScore(events: PlayerEventData[]) {
    if (!homeTeam || !awayTeam) return 0;
    return events.filter(event => {
      const isAwayTeamGoal = event.clubId === awayTeam!.id && "Goal" in event.eventType;
      const isHomeTeamOwnGoal = event.clubId === homeTeam!.id && "OwnGoal" in event.eventType;
      return isAwayTeamGoal || isHomeTeamOwnGoal;
    }).length;
  }
</script>

<Layout>
  <div class="relative min-h-screen bg-BrandGray/90;">
    <div class="flex flex-col md:flex-row">
      <div class="flex-1 md:block">  
        {#if isLoading}
          <FullScreenSpinner />
        {:else if submitting}
          <div class="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div class="pb-12">
              <FullScreenSpinner />
            </div>
            <p class="pt-12 text-xl text-center">Submitting proposal...</p>
          </div>
        {:else}
          <div class="flex flex-col w-full min-h-screen rounded-xl backdrop-blur ">
            <div class="flex flex-col p-3 my-2 space-y-4 md:my-0 md:mb-4 md:p-0 md:flex-row md:space-y-0 md:space-x-4">
              <div class="flex flex-row items-center justify-center w-full py-4 space-x-4 border md:w-1/3 bg-panel-color">
                <div class="flex flex-col justify-center space-y-2">
                  <BadgeIcon
                    className="h-8 lg:h-12"
                    primaryColour={homeTeam?.primaryColourHex}
                    secondaryColour={homeTeam?.secondaryColourHex}
                    thirdColour={homeTeam?.thirdColourHex}
                  />
                  <p class="text-sm text-center">{homeTeam?.abbreviatedName}</p>
                </div>
                {#if homeTeam && awayTeam}
                  <p class="text-3xl lg:text-4xl">
                    {calculateHomeScore($playerEventData)}-{calculateAwayScore($playerEventData)}
                  </p>
                {:else}
                  <p class="text-4xl">0-0</p>
                {/if}
                <div class="flex flex-col justify-center space-y-2">
                  <BadgeIcon
                    className="h-8 lg:h-12"
                    primaryColour={awayTeam?.primaryColourHex}
                    secondaryColour={awayTeam?.secondaryColourHex}
                    thirdColour={awayTeam?.thirdColourHex}
                  />
                  <p class="text-sm text-center">{awayTeam?.abbreviatedName}</p>
                </div>
              </div>
              <div class="flex flex-row w-full p-4 space-x-4 text-xs text-gray-400 border md:w-2/3 md:text-sm bg-panel-color">
                <div class="flex-col w-1/2 space-y-4">
                  <p>{homeTeam?.name}</p>
                  <div class="flex flex-col space-y-2">
                    <p>Goals: {homeGoalsText}</p>
                    <p>Assists: {homeAssistsText}</p>
                  </div>
                </div>
                <div class="flex-col w-1/2 space-y-4">
                  <p>{awayTeam?.name}</p>
                  <div class="flex flex-col space-y-2">
                    <p>Goals: {awayGoalsText}</p>
                    <p>Assists: {awayAssistsText}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="border rounded-md bg-panel">
              <div class="flex flex-col">
                <div class="flex w-full">
                  <ul
                    class="flex w-full px-4 pt-2 border-b border-gray-700 bg-light-gray"
                  >
                    <li class={`mr-4 ${activeTab === "home" ? "active-tab" : ""}`}>
                      <button
                        class={`p-2 ${
                          activeTab === "home" ? "text-white" : "text-gray-400"
                        }`}
                        on:click={() => setActiveTab("home")}
                        >{homeTeam?.friendlyName}</button
                      >
                    </li>
                    <li class={`mr-4 ${activeTab === "away" ? "active-tab" : ""}`}>
                      <button
                        class={`p-2 ${
                          activeTab === "away" ? "text-white" : "text-gray-400"
                        }`}
                        on:click={() => setActiveTab("away")}
                        >{awayTeam?.friendlyName}</button
                      >
                    </li>
                  </ul>
                </div>
                <div class="flex flex-row items-center p-4 space-x-2">
                  <p>Selected Players</p>
                  <button
                    class="justify-end px-4 py-2 brand-button"
                    on:click={showSelectPlayersModal}>Select Players</button
                  >
                </div>
                <div class="flex flex-col w-full">
                  <div
                    class="flex flex-row items-center justify-between py-4 border border-gray-700 bg-light-gray"
                  >
                    <div class="w-1/6 px-4">#</div>
                    <div class="w-3/6 px-4">Player</div>
                    <div class="w-1/6 px-4">Events</div>
                    <div class="w-1/6 px-4">Action</div>
                  </div>

                  <SelectedPlayerList view={activeTab} {selectedPlayers} fixture={fixture!} {playerEventData} {handleEditPlayerEvents} />
                </div>
                <div class="flex flex-row items-center justify-end p-4 space-x-2">
                  <button
                    class="px-4 py-2 brand-button"
                    on:click={saveDraft}>Save Draft</button
                  >
                  <button
                    class="px-4 py-2 brand-button"
                    on:click={showConfirmClearDraftModal}>Clear Draft</button
                  >
                  <button
                    class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
                    px-4 py-2`}
                    on:click={displayConfirmDataModal}
                    disabled={isSubmitDisabled}>Submit Proposal</button
                  >
                </div>

                <div class="flex flex-col w-full m-4 space-y-4 text-xs md:flex-row md:text-sm md:space-y-0">
                  <div class="w-full px-4 border-gray-600 md:w-1/3 md:border-r">
                    <div class="flex-grow">
                      Appearances: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 0
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Goals: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 1
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Own Goals: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 10
                      ).length}
                    </div>
                  </div>
                  <div class="w-full px-4 pt-4 border-t border-gray-600 md:w-1/3 md:border-r md:border-t-0 md:pt-0">
                    <div class="flex-grow">
                      Assists: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 2
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Keeper Saves: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 4
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Yellow Cards: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 8
                      ).length}
                    </div>
                  </div>
                  <div class="w-full px-4 pt-4 border-t md:w-1/3 md:border-t-0 md:pt-0">
                    <div class="flex-grow">
                      Red Cards: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 9
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Penalties Saved: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 6
                      ).length}
                    </div>
                    <div class="flex-grow">
                      Penalties Missed: {$playerEventData.filter(
                        (x) => convertEvent(x.eventType) == 7
                      ).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</Layout>

{#if showPlayerSelectionModal && selectedTeam}
  <SelectPlayersModal
    visible={showPlayerSelectionModal}
    teamPlayers={$teamPlayers}
    {selectedTeam}
    closeModal={closeSelectPlayersModal}
    {selectedPlayers}
    {playerEventData}
  />
{/if}

{#if showPlayerEventModal && selectedPlayer}
  <PlayerEventsModal
    visible={showPlayerEventModal}
    player={selectedPlayer}
    {fixtureId}
    {playerEventData}
    on:closed={handleModalClosed}
    closeModal={closeEventPlayerEventsModal}
  />
{/if}

<ConfirmFixtureDataModal
  visible={showConfirmDataModal}
  onConfirm={confirmFixtureData}
  closeModal={closeConfirmDataModal}
/>

<ClearDraftModal
  closeModal={closeConfirmClearDraftModal}
  visible={showClearDraftModal}
  onConfirm={clearDraft}
/>
