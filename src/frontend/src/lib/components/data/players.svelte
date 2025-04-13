<script lang="ts">
    import { onMount, onDestroy } from "svelte";
  
    import { countryStore } from "$lib/stores/country-store";
    import { leagueStore } from "$lib/stores/league-store";
    import { clubStore } from "$lib/stores/club-store";
    import { playerStore } from "$lib/stores/player-store";
    
    import CreatePlayer from "$lib/components/governance/proposals/player/create-player.svelte";
    import UpdatePlayer from "$lib/components/governance/proposals/player/update-player.svelte";
    import TransferPlayer from "$lib/components/governance/proposals/player/transfer-player.svelte";
    import LoanPlayer from "$lib/components/governance/proposals/player/loan-player.svelte";
    import SetFreeAgent from "$lib/components/governance/proposals/player/set-free-agent.svelte";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import RecallPlayer from "$lib/components/governance/proposals/player/recall-player.svelte";
    import RevaluePlayerDown from "$lib/components/governance/proposals/player/revalue-player-down.svelte";
    import RevaluePlayerUp from "$lib/components/governance/proposals/player/revalue-player-up.svelte";
    import PlayersHeaderDisplay from "$lib/components/governance/proposals/player/players-header-display.svelte";
    import PlayerDisplay from "$lib/components/player/player-display.svelte";
    import type { Club, Country, League, Player } from "../../../../../declarations/backend/backend.did";
      
  
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
    
    let leagues: League[] = [];
    let clubs: Club[] = [];
    let countries: Country[] = [];
    
    let filteredPlayers: Player[] = [];
    let allLeaguePlayers: Record<number, Player[]> = {};
    
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
  
    $: leagueOptions = leagues.map(league => ({
      id: league.id,
      label: league.name
    }));
  
    $: clubOptions = clubs.map(club => ({
      id: club.id,
      label: club.friendlyName
    }));
  
    $: positionOptions = positions.map(pos => ({
      id: pos.id,
      label: pos.positionName
    }));
  
    $: nationalityOptions = countries.map(country => ({
      id: country.id,
      label: country.name
    }));
  
    onMount(async () => {
      try {
  
        let countriesResult = await countryStore.getCountries();
        if(!countriesResult) throw new Error("Failed to fetch countries");
        countries = countriesResult.countries;
  
        let leaguesResult = await leagueStore.getLeagues();
        if(!leaguesResult) throw new Error("Error loading leagues")
        leagues  = leaguesResult.leagues;
        let clubsResult = await clubStore.getClubs(selectedLeagueId);
        if(!clubsResult) throw new Error("Error loading clubs")
        clubs = clubsResult.clubs;
        await fetchPlayersForLeague(selectedLeagueId);
        if (typeof window !== 'undefined') {
          document.addEventListener('click', handleClickOutside);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading = false;
      }
    });
  
    onMount(() => {
      if (typeof window !== 'undefined') {
        document.addEventListener('click', handleClickOutside);
      }
    });
  
    onDestroy(() => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleClickOutside);
      }
    });
  
    async function fetchPlayersForLeague(leagueId: number) {
      if (!allLeaguePlayers[leagueId]) {
        try {
          let playersResult = await playerStore.getPlayers(leagueId);
          if(!playersResult) throw new Error("Failed to fetch players");
          let players = playersResult.players;
          allLeaguePlayers[leagueId] = players;
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
  
      const minValueNum = Number(minValue) || 0;
      const maxValueNum = Number(maxValue) || 150;
      const searchTerm = searchSurname?.toLowerCase() || "";
  
      filteredPlayers = leaguePlayers
        .filter(player =>
          (selectedPositionId == 0 || Object.keys(player.position).includes(filterPosition)) &&
          (selectedClubId == 0 || player.clubId === selectedClubId) &&
          (selectedNationalityId == 0 || player.nationality === selectedNationalityId) &&
          (player.valueQuarterMillions / 4) >= minValueNum && 
          (player.valueQuarterMillions / 4) <= maxValueNum &&
          (searchTerm === "" || player.lastName.toLowerCase().includes(searchTerm))
        );
    }
  
  
    async function filterClubs() {  
      let clubsResult = await clubStore.getClubs(selectedLeagueId);
        if(!clubsResult) throw new Error("Error loading clubs")
        clubs = clubsResult.clubs;
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
  
    function handleLeagueChange(value: string | number) {
      selectedLeagueId = Number(value);
      filterPlayers();
    }
  
    function handleClubChange(value: string | number) {
      selectedClubId = Number(value);
      filterPlayers();
    }
  
    function handlePositionChange(value: string | number) {
      selectedPositionId = Number(value);
      filterPlayers();
    }
  
    function handleNationalityChange(value: string | number) {
      selectedNationalityId = Number(value);
      filterPlayers();
    }
  
  </script>
  
{#if isLoading}
  <LocalSpinner />
{:else}

  <div class="flex items-center justify-between w-full my-4">
    <button class="brand-button" on:click={createNewPlayer}>+ New Player</button>
  </div>

  {#if loadingPlayers || loadingClubs}
    <LocalSpinner />
  {:else}
    <PlayersHeaderDisplay
      leagues={leagueOptions}
      clubs={clubOptions}
      positions={positionOptions}
      nationalities={nationalityOptions}
      bind:selectedLeagueId
      bind:selectedClubId
      bind:selectedPositionId
      bind:selectedNationalityId
      bind:minValue
      bind:maxValue
      bind:searchSurname
      onLeagueChange={handleLeagueChange}
      onClubChange={handleClubChange}
      onPositionChange={handlePositionChange}
      onNationalityChange={handleNationalityChange}
      onValueChange={filterPlayers}
      onSearch={filterPlayers}
      onKeyPress={handleKeyPress}
    />    
      
    <div class="px-3 mt-4 mb-4 space-y-4 md:px-0">
        {#each filteredPlayers.sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions) as player}
        {@const playerClub = clubs.find(x => x.id == player.clubId)}
        <PlayerDisplay
            {player}
            club={playerClub!}
            {dropdownVisible}
            onDropdownClick={toggleDropdown}
            onUpdatePlayer={loadUpdatePlayer}
            onSetPlayerInjury={loadSetPlayerInjury}
            onTransferPlayer={loadTransferPlayer}
            onLoanPlayer={loadLoanPlayer}
            onRecallPlayer={loadRecallPlayer}
            onRevaluePlayerUp={loadRevaluePlayerUp}
            onRevaluePlayerDown={loadRevaluePlayerDown}
            onRetirePlayer={loadRetirePlayer}
            onUnretirePlayer={loadUnretirePlayer}
            onSetFreeAgent={loadSetFreeAgent}
        />
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
        <UpdatePlayer visible={showUpdatePlayerModal} {closeModal} selectedPlayer={selectedPlayer!} />
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
    {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
        <SetFreeAgent visible={showSetFreeAgentModal} {closeModal} selectedPlayer={selectedPlayer!} />
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