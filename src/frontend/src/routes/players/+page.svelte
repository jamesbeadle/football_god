<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { countryStore } from "$lib/stores/country-store";
  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  
  import Layout from "../Layout.svelte";
  import CreatePlayer from "$lib/components/governance/player/create-player.svelte";
  import UpdatePlayer from "$lib/components/governance/player/update-player.svelte";
  import TransferPlayer from "$lib/components/governance/player/transfer-player.svelte";
  import LoanPlayer from "$lib/components/governance/player/loan-player.svelte";
  import SetFreeAgent from "$lib/components/governance/player/set-free-agent.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import RecallPlayer from "$lib/components/governance/player/recall-player.svelte";
  import RevaluePlayerDown from "$lib/components/governance/player/revalue-player-down.svelte";
    import RevaluePlayerUp from "$lib/components/governance/player/revalue-player-up.svelte";
    import type { ClubDTO, CountryDTO, FootballLeagueDTO, PlayerDTO } from "../../../../declarations/data_canister/data_canister.did";

  let isLoading = true;
  let loadingPlayers = false;
  let loadingClubs = false;

  let selectedLeagueId: number = 1;
  let selectedClubId: number = 0;
  let selectedPlayerId = 0;
  let selectedPositionId: number = 0;
  let selectedNationalityId = 0;
  let minValue: number = 0;
  let maxValue: number = 150;
  let searchSurname = "";
  
  let leagues: FootballLeagueDTO[] = [];
  let clubs: ClubDTO[] = [];
  let countries: CountryDTO[] = [];
  
  let filteredPlayers: PlayerDTO[] = [];
  let allLeaguePlayers: Record<number, PlayerDTO[]> = {};
  
  let positions = [
      { id: 1, positionName: "Goalkeeper"},
      { id: 2, positionName: "Defender"},
      { id: 3, positionName: "Midfielder"},
      { id: 4, positionName: "Forward"}
  ];

  let dropdownVisible: number | null = null;
  
  let showTransferPlayerModal = false;
  let showLoanPlayerModal = false;
  let showRecallPlayerModal = false;
  let showRevaluePlayerUpModal = false;
  let showRevaluePlayerDownModal = false;
  let showRetirePlayerModal = false;
  let showUnretirePlayerModal = false;
  let showCreatePlayerModal = false;
  let showUpdatePlayerModal = false;
  let showSetPlayerInjuryModal = false;
  let showSetFreeAgentModal = false;

  onMount(async () => {
    try {
      countries = await countryStore.getCountries();
      leagues = await leagueStore.getLeagues();
      clubs = await clubStore.getClubs(selectedLeagueId);
      await fetchPlayersForLeague(selectedLeagueId);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  });

  onMount(() => {
      document.addEventListener('click', handleClickOutside);

      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  async function fetchPlayersForLeague(leagueId: number) {
    if (!allLeaguePlayers[leagueId]) {
      try {
        const leaguePlayers = await playerStore.getPlayers(leagueId);
        allLeaguePlayers[leagueId] = leaguePlayers;
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
    filterPlayers();
    loadingPlayers = false;
  }

  function filterPlayers() {
    let leaguePlayers = allLeaguePlayers[selectedLeagueId] || [];

    let filterPosition = "Goalkeeper";
    switch(selectedPositionId){
        case 2:
            filterPosition = "Defender";
            break;
        case 3:
            filterPosition = "Midfielder";
            break;
        case 4:
            filterPosition = "Forward";
            break;
        default:
            break;
    }

    filteredPlayers = leaguePlayers
      .filter(player =>
        (selectedPositionId == 0 || Object.keys(player.position).includes(filterPosition)) &&
        (selectedClubId == 0 || player.clubId === selectedClubId) &&
        (selectedNationalityId == 0 || player.nationality === selectedNationalityId) &&
        (player.valueQuarterMillions / 4) >= minValue && (player.valueQuarterMillions / 4) <= maxValue &&
        (searchSurname === "" || player.lastName.toLowerCase().includes(searchSurname.toLowerCase()))
      );
  }


  async function filterClubs() {  
      clubs = await clubStore.getClubs(selectedLeagueId);
      loadingClubs = false;
  }

  function toggleDropdown(playerId: number, event: MouseEvent) {
      event.stopPropagation();
      dropdownVisible = dropdownVisible === playerId ? null : playerId;
  }

  function loadUpdatePlayer(playerId: number){
      selectedPlayerId = playerId;
      showUpdatePlayerModal = true;
  }

  function loadSetPlayerInjury(playerId: number){
      selectedPlayerId = playerId;
      showSetPlayerInjuryModal = true;
  }

  function loadTransferPlayer(playerId: number){
      selectedPlayerId = playerId;
      showTransferPlayerModal = true;
  }

  function loadLoanPlayer(playerId: number){
      selectedPlayerId = playerId;
      showLoanPlayerModal = true;
  }

  function loadRecallPlayer(playerId: number){
      selectedPlayerId = playerId;
      showRecallPlayerModal = true;
  }

  function loadRevaluePlayerUp(playerId: number){
      selectedPlayerId = playerId;
      showRevaluePlayerUpModal = true;
  }

  function loadRevaluePlayerDown(playerId: number){
      selectedPlayerId = playerId;
      showRevaluePlayerDownModal = true;
  }

  function loadRetirePlayer(playerId: number){
      selectedPlayerId = playerId;
      showRetirePlayerModal = true;
  }

  function loadUnretirePlayer(playerId: number){
      selectedPlayerId = playerId;
      showUnretirePlayerModal = true;
  }

  function loadSetFreeAgent(playerId: number) {
      selectedPlayerId = playerId;
      showSetFreeAgentModal = true;
  }

  function closeModal(){
      selectedPlayerId = 0;
      showTransferPlayerModal = false;
      showLoanPlayerModal = false;
      showRecallPlayerModal = false;
      showCreatePlayerModal = false;
      showUpdatePlayerModal = false;
      showRevaluePlayerUpModal = false;
      showRevaluePlayerDownModal = false;
      showRetirePlayerModal = false;
      showUnretirePlayerModal = false;
      showSetPlayerInjuryModal = false;
      showSetFreeAgentModal = false;
  }

  function handleClickOutside(event: MouseEvent) {
      const dropdownElements = document.querySelectorAll('.dropdown-menu');
      const targetElement = event.target as HTMLElement;

      if (![...dropdownElements].some(dropdown => dropdown.contains(targetElement))) {
          dropdownVisible = null;
      }
  }

  function createNewPlayer() {
    showCreatePlayerModal = true;
  }

  $: if (selectedLeagueId && selectedLeagueId > 0) {
    loadingPlayers = true;
    loadingClubs = true;
    fetchPlayersForLeague(selectedLeagueId);
    filterClubs();
  }

  $: if (selectedClubId || selectedPositionId || minValue || maxValue) {
      filterPlayers();
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      filterPlayers();
    }
  }

</script>

<Layout>
  {#if isLoading}
    <LocalSpinner />
  {:else}

    <div class="flex justify-between items-center w-full mb-4">
      <p class="text-lg">Player Explorer</p>
      <button class="brand-button" on:click={createNewPlayer}>+ New Player</button>
    </div>


    {#if loadingPlayers || loadingClubs}
      <LocalSpinner />
    {:else}
      <div>

        <div class="flex flex-col md:flex-row md:space-x-2 mb-2">

          <select class="block w-full md:w-1/2 brand-select mb-2 md:mb-0" bind:value={selectedLeagueId} on:change={filterPlayers}>
            <option value={0}>Select League</option>
            {#each leagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          <select class="block w-full md:w-1/2 brand-select" bind:value={selectedClubId} on:change={filterPlayers}>
            <option value={0}>Select Club</option>
            {#each clubs as club}
              <option value={club.id}>{club.name}</option>
            {/each}
          </select>

        </div>
        
        <div class="flex flex-col md:flex-row md:space-x-2 mb-2">
          <select class="block w-full md:w-1/2 brand-select mb-2 md:mb-0" bind:value={selectedPositionId} on:change={filterPlayers}>
            <option value={0}>Select Position</option>
            {#each positions as position}
              <option value={position.id}>{position.positionName}</option>
            {/each}
          </select>

          <select class="block w-full md:w-1/2 brand-select" bind:value={selectedNationalityId} on:change={filterPlayers}>
            <option value={0}>Select Nationality</option>
            {#each countries as country}
              <option value={country.id}>{country.name}</option>
            {/each}
          </select>
        </div>  

        <div class="flex flex-col md:flex-row md:space-x-2 my-2">
          <div class="flex flex-col w-full md:w-1/2 mb-2 md:mb-0">
            <label for="minValue" class="text-xs text-white mb-1">Min Value (M):</label>
            <input
              type="number"
              id="minValue"
              bind:value={minValue}
              step="0.25"
              class="brand-input w-full"
              on:input={filterPlayers}
            />
          </div>
        
          <div class="flex flex-col w-full md:w-1/2">
            <label for="maxValue" class="text-xs text-white mb-1">Max Value (M):</label>
            <input
              type="number"
              id="maxValue"
              bind:value={maxValue}
              step="0.25"
              class="brand-input w-full"
              on:input={filterPlayers}
            />
          </div>
        </div>
        
        <div class="flex flex-col mb-2">
          <label for="searchSurname" class="text-xs text-white mb-1">Search by Surname:</label>
          <div class="flex">
            <input
              type="text"
              id="searchSurname"
              bind:value={searchSurname}
              class="brand-input flex-grow"
              on:keypress={handleKeyPress}
            />
            <button
              class="brand-button ml-2 text-sm"
              on:click={filterPlayers}
            >
              Search
            </button>
          </div>
        </div>
        
        
      </div>

      <div class="mt-4">
        {#each filteredPlayers.sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions) as player}
          <div class="flex flex-row items-center bg-BrandDarkGray rounded-lg shadow p-4 w-full my-2 transition hover:bg-gray-700">
            <div class="flex items-center space-x-4 w-full">
              <p class="flex-grow text-lg md:text-sm text-white">
                {player.firstName} {player.lastName} <br />
                Player ID: {player.id} <br />
                Value: £{(player.valueQuarterMillions / 4)}M <br />
                Status: {Object.keys(player.status)[0]}
              </p>
              <div class="relative">
                <button class="text-white brand-button" on:click={(event) => toggleDropdown(player.id, event)}>Actions</button>
                {#if dropdownVisible === player.id}
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 text-sm dropdown-menu">
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadUpdatePlayer(player.id)}>Update Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadSetPlayerInjury(player.id)}>Set Player Injury</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadTransferPlayer(player.id)}>Transfer Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadLoanPlayer(player.id)}>Loan Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadRecallPlayer(player.id)}>Recall Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadRevaluePlayerUp(player.id)}>Revalue Player Up</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadRevaluePlayerDown(player.id)}>Revalue Player Down</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadRetirePlayer(player.id)}>Retire Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadUnretirePlayer(player.id)}>Unretire Player</button>
                    <button class="block w-full text-left px-4 py-2 text-BrandDarkGray hover:bg-BrandLightGray" on:click={() => loadSetFreeAgent(player.id)}>Set Player As Free Agent</button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if selectedPlayerId > 0 && showLoanPlayerModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        <LoanPlayer visible={showLoanPlayerModal} {closeModal} selectedPlayer={selectedPlayer!} />
      {/if}
    
      {#if showCreatePlayerModal}
      <CreatePlayer visible={showCreatePlayerModal} {closeModal} />
      {/if}
    
      {#if selectedPlayerId > 0 && showUpdatePlayerModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        <UpdatePlayer visible={showUpdatePlayerModal} {closeModal} selectedClubId={selectedPlayer ? selectedPlayer.clubId ?? 0 : 0} {selectedPlayerId} {selectedLeagueId} />
      {/if}
    
      {#if selectedPlayerId > 0 && showTransferPlayerModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        <TransferPlayer visible={showTransferPlayerModal} {closeModal} selectedPlayer={selectedPlayer!} />
      {/if}
    
      {#if selectedPlayerId > 0 && showRecallPlayerModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        <RecallPlayer visible={showRecallPlayerModal} {closeModal} selectedPlayer={selectedPlayer!} />
      {/if}
    
      {#if selectedPlayerId > 0 && showSetFreeAgentModal}
        <SetFreeAgent visible={showRecallPlayerModal} {closeModal} selectedPlayerId={selectedPlayerId} />
      {/if}
    
      {#if selectedPlayerId > 0 && showRevaluePlayerUpModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        {@const playerClub = clubs.find(x => x.id == selectedPlayer!.clubId) }
        <RevaluePlayerUp visible={showRevaluePlayerUpModal} {closeModal} club={playerClub!} player={selectedPlayer!} />
      {/if}
    
      {#if selectedPlayerId > 0 && showRevaluePlayerDownModal}
        {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        {@const playerClub = clubs.find(x => x.id == selectedPlayer!.clubId) }
        <RevaluePlayerDown visible={showRevaluePlayerDownModal} {closeModal} club={playerClub!} player={selectedPlayer!} />
      {/if}
    
    {/if}
  {/if}
</Layout>