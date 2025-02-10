<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";

  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { playerStore } from "$lib/stores/player-store";
  import Layout from "../Layout.svelte";
  import PlayerEventsModal from "$lib/components/fixture-validation/player-events-modal.svelte";
  import SelectPlayersModal from "$lib/components/fixture-validation/select-players-modal.svelte";
  import ConfirmFixtureDataModal from "$lib/components/fixture-validation/confirm-fixture-data-modal.svelte";
  import ClearDraftModal from "$lib/components/fixture-validation/clear-draft-modal.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  
  import { convertEvent, isError, replacer } from "$lib/utils/helpers";
  import SelectedPlayerList from "$lib/components/fixture-validation/selected-player-list.svelte";
  import type { ClubDTO, FixtureDTO, PlayerDTO, PlayerEventData, SubmitFixtureDataDTO } from "../../../../declarations/data_canister/data_canister.did";
  import { governanceStore } from "$lib/stores/governance-store";
    import { leagueStore } from "$lib/stores/league-store";
  
  let clubs: ClubDTO[] = [];
  let players: PlayerDTO[] = [];
  let fixture: FixtureDTO | undefined;
  let selectedTeam: ClubDTO | null = null;
  let homeTeam: ClubDTO | null;
  let awayTeam: ClubDTO | null;

  let activeTab: string = "home";
  let showPlayerSelectionModal = false;
  let showPlayerEventModal = false;
  let showClearDraftModal = false;
  let showConfirmDataModal = false;

  let selectedPlayer: PlayerDTO | null = null;

  let teamPlayers = writable<PlayerDTO[]>([]);
  let selectedPlayers = writable<PlayerDTO[]>([]);
  let playerEventData = writable<PlayerEventData[]>([]);

  let homeGoalsText = "";
  let awayGoalsText = "";
  let homeAssistsText = "";
  let awayAssistsText = "";
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

      let selectedPlayersData: PlayerDTO[] = draftData.selectedPlayers;
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
      isLoading = true;
      let dto: SubmitFixtureDataDTO = {
        seasonId,
        leagueId,
        fixtureId : fixtureId,
        gameweek,
        playerEventData: $playerEventData
      };
      
      submitting = true;
      let result = await governanceStore.submitFixtureData(dto);

      if (isError(result)) {
        isLoading = false;
        submitting = false;
        console.error("Error submitting proposal");
        return;
      }
      submitted = true;
      submitting = false;
      localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    } catch (error) {
      console.error("Error saving fixture data: ", error);
    } finally {
      isLoading = false;
      showConfirmDataModal = false;
    }
  }

  function saveDraft() {
    let uniquePlayers = new Set<PlayerDTO>();
    $playerEventData.forEach((event) => {
      uniquePlayers.add(players.find(x => x.id == event.playerId)!);
    });


    let allSelectedPlayers = new Set<PlayerDTO>();
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
  }

  function clearDraft() {
    playerEventData = writable<PlayerEventData[]>([]);
    selectedPlayers = writable<PlayerDTO[]>([]);
    localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    closeConfirmClearDraftModal();
  }

  async function setActiveTab(tab: string) {
    selectedTeam = tab === "home" ? homeTeam : awayTeam;
    teamPlayers.set(players.filter((x) => x.clubId == selectedTeam?.id));
    activeTab = tab;
  }

  function handleEditPlayerEvents(player: PlayerDTO) {
    selectedPlayer = player;
    showPlayerEventModal = true;
  }

  function handleRemovePlayer(player: PlayerDTO) {
    selectedPlayers.set($selectedPlayers.filter((x) => x.id != player.id));
    playerEventData.set($playerEventData.filter(x => x.playerId != player.id))
  }

  function closeEventPlayerEventsModal(): void {
    showPlayerEventModal = false;
    selectedPlayer = null;
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
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <div class="flex flex-row space-x-4 mb-4">
      <div
        class="bg-panel-color rounded-md w-1/3 flex flex-row items-center justify-center space-x-4 py-4"
      >
        <div class="flex-col flex justify-center space-y-2">
          <BadgeIcon
            className="h-12"
            primaryColour={homeTeam?.primaryColourHex}
            secondaryColour={homeTeam?.secondaryColourHex}
            thirdColour={homeTeam?.thirdColourHex}
          />
          <p class="text-center text-sm">{homeTeam?.abbreviatedName}</p>
        </div>
        <p class="text-4xl">0-0</p>
        <div class="flex-col flex justify-center space-y-2">
          <BadgeIcon
            className="h-12"
            primaryColour={awayTeam?.primaryColourHex}
            secondaryColour={awayTeam?.secondaryColourHex}
            thirdColour={awayTeam?.thirdColourHex}
          />
          <p class="text-center text-sm">{awayTeam?.abbreviatedName}</p>
        </div>
      </div>
      <div
        class="bg-panel-color rounded-md w-2/3 flex flex-row space-x-4 p-4 text-gray-400 text-sm"
      >
        <div class="w-1/2 flex-col space-y-4">
          <p>{homeTeam?.name}</p>
          <div class="flex flex-col space-y-2">
            <p>Goals: {homeGoalsText}</p>
            <p>Assists: {homeAssistsText}</p>
          </div>
        </div>
        <div class="w-1/2 flex-col space-y-4">
          <p>{awayTeam?.name}</p>
          <div class="flex flex-col space-y-2">
            <p>Goals: {awayGoalsText}</p>
            <p>Assists: {awayAssistsText}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-panel rounded-md">
      <div class="flex flex-col">
        <div class="flex w-full">
          <ul
            class="flex bg-light-gray px-4 pt-2 w-full border-b border-gray-700"
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
        <div class="flex flex-row space-x-2 p-4 items-center">
          <p>Selected Players</p>
          <button
            class="brand-button px-4 py-2 justify-end"
            on:click={showSelectPlayersModal}>Select Players</button
          >
        </div>
        <div class="flex w-full flex-col">
          <div
            class="flex flex-row items-center justify-between border border-gray-700 py-4 bg-light-gray"
          >
            <div class="w-1/6 px-4">#</div>
            <div class="w-3/6 px-4">Player</div>
            <div class="w-1/6 px-4">Events</div>
            <div class="w-1/6 px-4">Action</div>
          </div>

          <SelectedPlayerList view={activeTab} {selectedPlayers} fixture={fixture!} {playerEventData} {handleEditPlayerEvents} />
        </div>
        <div class="flex flex-row space-x-2 p-4 items-center justify-end">
          <button
            class="brand-button px-4 py-2"
            on:click={saveDraft}>Save Draft</button
          >
          <button
            class="brand-button px-4 py-2"
            on:click={showConfirmClearDraftModal}>Clear Draft</button
          >
          <button
            class={`${isSubmitDisabled ? "brand-button-disabled" : "brand-button"} 
            px-4 py-2`}
            on:click={displayConfirmDataModal}
            disabled={isSubmitDisabled}>Submit Proposal</button
          >
        </div>

        <div class="flex flex-row w-full m-4 text-sm">
          <div class="w-1/3 border-r border-gray-600 px-4">
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
          <div class="w-1/3 border-r border-gray-600 px-4">
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
          <div class="w-1/3 px-4">
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
  {/if}
</Layout>

{#if selectedTeam}
  <SelectPlayersModal
    visible={showPlayerSelectionModal}
    teamPlayers={$teamPlayers}
    {selectedTeam}
    closeModal={closeSelectPlayersModal}
    {selectedPlayers}
    {playerEventData}
  />
{/if}

{#if selectedPlayer}
  <PlayerEventsModal
    visible={showPlayerEventModal}
    player={selectedPlayer}
    {fixtureId}
    {playerEventData}
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
