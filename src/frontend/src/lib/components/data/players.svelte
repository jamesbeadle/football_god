<script lang="ts">


    /* ----- Svelte Imports ----- */

    import { onMount, onDestroy } from "svelte";


    /* ----- Page Stores ----- */

    import { countryStore } from "$lib/stores/country-store";
    import { leagueStore } from "$lib/stores/league-store";
    import { clubStore } from "$lib/stores/club-store";
    import { playerStore } from "$lib/stores/player-store";


    /* ----- Types ----- */

    import type { Club, Country, League, Player } from "../../../../../declarations/backend/backend.did";
    

    /* ----- Component Imports ----- */

    import CreatePlayer from "$lib/components/governance/proposals/player/create-player.svelte";
    import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
    import PlayersHeaderDisplay from "$lib/components/governance/proposals/player/players-header-display.svelte";
    import PlayerDisplay from "$lib/components/player/player-display.svelte";
      
  

    /* // TODO - Refactor to utilities */
    let positions = [
        { id: 1, positionName: "Goalkeeper"},
        { id: 2, positionName: "Defender"},
        { id: 3, positionName: "Midfielder"},
        { id: 4, positionName: "Forward"}
    ];




    /* ----- State Variables ----- */

    /* ----- Loading ----- */

    let isLoading = $state(true);
    let loadingPlayers = $state(false);
    let loadingClubs = $state(false);

    /* ----- Data Filters ----- */

    let selectedLeagueId: number = $state(1);
    let selectedClubId: number = $state(0);
    let selectedPositionId: number = $state(0);
    let selectedNationalityId = $state(0);    
    let minValue: number = $state(0);
    let maxValue: number = $state(150);
    let searchSurname = $state("");
    
    /* ----- Modal Load Flags ----- */

    let showCreatePlayerModal = $state(false);
    
    /* ----- Data Objects ----- */

    let leagues: League[] = [];
    let clubs: Club[] = $state([]);
    let countries: Country[] = [];
    let allLeaguePlayers: Record<number, Player[]> = $state({});
    let filteredPlayers: Player[] = $state([]);
    

    /* ----- Other Display Properties?? ----- */

    let dropdownVisible: number | null = $state(null);
    

    /* ----- Derived Display Properties?? ----- */

    let leagueOptions = $derived(leagues.map(league => ({
      id: league.id,
      label: league.name
    })));
  
    let clubOptions = $derived(clubs.map(club => ({
      id: club.id,
      label: club.friendlyName
    })));
  
    let positionOptions = $derived(positions.map(pos => ({
      id: pos.id,
      label: pos.positionName
    })));
  
    let nationalityOptions = $derived(countries.map(country => ({
      id: country.id,
      label: country.name
    })));


    /* ----- Effect Display Properties?? ----- */
    
    $effect(() => {
      const leaguePlayers = allLeaguePlayers[selectedLeagueId] || [];
      const minValueNum = Number(minValue) || 0;
      const maxValueNum = Number(maxValue) || 150;
      const searchTerm = searchSurname?.toLowerCase() || "";
      const filterPosition =
        selectedPositionId === 1 ? "Goalkeeper" :
        selectedPositionId === 2 ? "Defender" :
        selectedPositionId === 3 ? "Midfielder" :
        selectedPositionId === 4 ? "Forward" : null;

      filteredPlayers =  leaguePlayers.filter(
        (player) =>
          (!filterPosition || Object.keys(player.position).includes(filterPosition)) &&
          (selectedClubId === 0 || player.clubId === selectedClubId) &&
          (selectedNationalityId === 0 || player.nationality === selectedNationalityId) &&
          player.valueQuarterMillions / 4 >= minValueNum &&
          player.valueQuarterMillions / 4 <= maxValueNum &&
          (searchTerm === "" || player.lastName.toLowerCase().includes(searchTerm))
      );
    });
  
    
    /* ----- Lifecycle ----- */
  
    onMount(async () => {
      try {

        console.log('mounting players')
  
        console.log('get countries')
        let countriesResult = await countryStore.getCountries();
        if(!countriesResult) throw new Error("Failed to fetch countries");
        countries = countriesResult.countries;
  
        console.log('get leagues')
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

        console.log('mounting complete')
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

  
    /* ----- Data Getters ----- */

    async function fetchPlayersForLeague(leagueId: number) {
      console.log('fetchPlayersForLeague')
      if (!allLeaguePlayers[leagueId]) {
        try {
          let playersResult = await playerStore.getPlayers(leagueId);
          if (!playersResult) throw new Error("Failed to fetch players");
          allLeaguePlayers = { ...allLeaguePlayers, [leagueId]: [...playersResult.players] }; // Immutable update
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }
      loadingPlayers = false;
      console.log('fetchPlayersForLeague complete')
    }
  
    async function filterClubs() {  
      console.log('filterClubs')
      let clubsResult = await clubStore.getClubs(selectedLeagueId);
        if(!clubsResult) throw new Error("Error loading clubs")
        clubs = [...clubsResult.clubs];
        loadingClubs = false;
        console.log('filterClubs complete')
    }







  
    function toggleDropdown(playerId: number, event: MouseEvent) {
        event.stopPropagation();
        dropdownVisible = dropdownVisible === playerId ? null : playerId;
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
    
    $effect(() => {
      if (selectedLeagueId && selectedLeagueId > 0) {

        console.log('mounting effect 1')
        loadingPlayers = true;
        loadingClubs = true;
        fetchPlayersForLeague(selectedLeagueId);
        filterClubs();
      }
    });

    function handleLeagueChange(value: string | number) {
      selectedLeagueId = Number(value);
    }

    function handleClubChange(value: string | number) {
      selectedClubId = Number(value);
    }

    function handlePositionChange(value: string | number) {
      selectedPositionId = Number(value);
    }

    function handleNationalityChange(value: string | number) {
      selectedNationalityId = Number(value);
    }

    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter") {
      }
    }

    function filterPlayers(){

    }

  
    function closeModal(){
        showCreatePlayerModal = false;
    }
  
  </script>
  
{#if isLoading}
  <LocalSpinner />
{:else}

  <div class="flex items-center justify-between w-full my-4">
    <button class="brand-button" onclick={createNewPlayer}>+ New Player</button>
  </div>

  {#if loadingPlayers || loadingClubs}
    <LocalSpinner />
  {:else}
    <PlayersHeaderDisplay
      leagues={leagueOptions}
      clubs={clubOptions}
      positions={positionOptions}
      nationalities={nationalityOptions}
      selectedLeagueId={selectedLeagueId}
      selectedClubId={selectedClubId}
      selectedPositionId={selectedPositionId}
      selectedNationalityId={selectedNationalityId}
      minValue={minValue}
      maxValue={maxValue}
      searchSurname={searchSurname}
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
        />
        {/each}
    </div>
    
    {/if}
{/if}




{#if showCreatePlayerModal}
    <CreatePlayer visible={showCreatePlayerModal} {closeModal} {selectedClubId} {selectedLeagueId} />
{/if}