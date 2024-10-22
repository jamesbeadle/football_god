<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { toastsError } from "$lib/stores/toasts-store";
    import { playerStore } from "$lib/stores/player-store";
    import { leagueStore } from "$lib/stores/league-store";
    import { clubStore } from "$lib/stores/club-store";
    import Layout from "../Layout.svelte";
    import type { ClubDTO, FootballLeagueDTO, PlayerDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
    import LoanPlayer from "$lib/components/governance/player/loan-player.svelte";
    import CreatePlayer from "$lib/components/governance/player/create-player.svelte";
    import UpdatePlayer from "$lib/components/governance/player/update-player.svelte";
    import TransferPlayer from "$lib/components/governance/player/transfer-player.svelte";

    let selectedLeagueId: number = 1;
    let selectedPositionId: number = 0;
    let selectedClubId: number = 0;
    let minValue: number = 0;
    let maxValue: number = 150;

    let leagues: FootballLeagueDTO[] = [];
    let positions = [
        { id: 1, positionName: "Goalkeeper"},
        { id: 2, positionName: "Defender"},
        { id: 3, positionName: "Midfielder"},
        { id: 4, positionName: "Forward"}
    ];

    let clubs: ClubDTO[] = [];
    let allLeaguePlayers: Record<number, PlayerDTO[]> = {};
    let filteredPlayers: PlayerDTO[] = [];
    let dropdownVisible: number | null = null;

    let showTransferPlayerModal = false;
    let showLoanPlayerModal = false;
    let showRevaluePlayerUpModal = false;
    let showRevaluePlayerDownModal = false;
    let showRetirePlayerModal = false;
    let showCreatePlayerModal = false;
    let showUpdatePlayerModal = false;

    let selectedPlayerId = 0;

    onMount(async () => {
      try {
        leagues = await leagueStore.getLeagues();
        await fetchPlayersForLeague(selectedLeagueId);
        clubs = await clubStore.getClubs(selectedLeagueId);
      } catch (error) {
        toastsError({
          msg: { text: "Error fetching data." },
          err: error,
        });
        console.error("Error fetching data:", error);
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
          toastsError({
            msg: { text: "Error fetching players." },
            err: error,
          });
          console.error("Error fetching players:", error);
        }
      }
      filterPlayers();
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
          (player.valueQuarterMillions / 4) >= minValue && (player.valueQuarterMillions / 4) <= maxValue
        );
    }

    async function filterClubs() {  
        clubs = await clubStore.getClubs(selectedLeagueId);
    }

    function toggleDropdown(playerId: number, event: MouseEvent) {
        event.stopPropagation();
        dropdownVisible = dropdownVisible === playerId ? null : playerId;
    }

    function loadUpdatePlayer(playerId: number){
        selectedPlayerId = playerId;
        showUpdatePlayerModal = true;
    }

    function loadTransferPlayer(playerId: number){
        selectedPlayerId = playerId;
        showTransferPlayerModal = true;
    }

    function loadLoanPlayer(playerId: number){
        selectedPlayerId = playerId;
        showLoanPlayerModal = true;
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

    function closeModal(){
        selectedPlayerId = 0;
        showTransferPlayerModal = false;
        showLoanPlayerModal = false;
        showCreatePlayerModal = false;
        showUpdatePlayerModal = false;
        showRevaluePlayerUpModal = false;
        showRevaluePlayerDownModal = false;
        showRetirePlayerModal = false;
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
        fetchPlayersForLeague(selectedLeagueId);
        filterClubs();
    }

    $: if (selectedClubId || selectedPositionId || minValue || maxValue) {
        filterPlayers();
    }
</script>

<Layout>
    <div class="page-header-wrapper flex w-full">
      <div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
        <div class="flex justify-between items-center w-full mb-4">
          <p class="text-2xl font-bold text-white">Player Explorer</p>
          <button 
            class="brand-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            on:click={createNewPlayer}>
            + New Player
          </button>
        </div>
        

        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <select class="form-select block w-full md:w-1/3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500" bind:value={selectedLeagueId} on:change={filterPlayers}>
            <option value={0}>Select League</option>
            {#each leagues as league}
              <option value={league.id}>{league.name}</option>
            {/each}
          </select>

          <select class="form-select block w-full md:w-1/3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500" bind:value={selectedPositionId} on:change={filterPlayers}>
            <option value={0}>Select Position</option>
            {#each positions as position}
              <option value={position.id}>{position.positionName}</option>
            {/each}
          </select>

          <select class="form-select block w-full md:w-1/3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500" bind:value={selectedClubId} on:change={filterPlayers}>
            <option value={0}>Select Club</option>
            {#each clubs as club}
              <option value={club.id}>{club.name}</option>
            {/each}
          </select>

          <div class="flex items-center w-full md:w-1/4">
            <label for="minValue" class="text-sm text-gray-400 mr-2">Min Value (M):</label>
            <input type="number" id="minValue" bind:value={minValue} step="0.25" class="form-input bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500 w-full" on:input={filterPlayers} />
          </div>

          <div class="flex items-center w-full md:w-1/4">
            <label for="maxValue" class="text-sm text-gray-400 mr-2">Max Value (M):</label>
            <input type="number" id="maxValue" bind:value={maxValue} step="0.25" class="form-input bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500 w-full" on:input={filterPlayers} />
          </div>
        </div>

        <div>
          {#each filteredPlayers.sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions) as player}
            <div class="flex flex-row items-center bg-gray-800 rounded-lg shadow p-4 w-full my-2 transition hover:bg-gray-700">
              <div class="flex items-center space-x-4 w-full">
                <p class="flex-grow text-lg md:text-sm text-white">
                  {player.firstName} {player.lastName} <br />
                  Player ID: {player.id} <br />
                  Value: £{(player.valueQuarterMillions/4)}M
                </p>
                
                <div class="relative">
                    <button class="text-white brand-button hover:bg-blue-700 px-4 py-2 rounded-lg" on:click={(event) => toggleDropdown(player.id, event)}>Actions</button>
                    {#if dropdownVisible === player.id}
                      <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 text-sm dropdown-menu">
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadUpdatePlayer(player.id)}>Update Player</button>
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadTransferPlayer(player.id)}>Transfer Player</button>
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadLoanPlayer(player.id)}>Loan Player</button>
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadRevaluePlayerUp(player.id)}>Revalue Player Up</button>
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadRevaluePlayerDown(player.id)}>Revalue Player Down</button>
                        <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" on:click={() => loadRetirePlayer(player.id)}>Retire Player</button>
                      </div>
                    {/if}
                  </div>
                  
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
</Layout>

{#if selectedPlayerId > 0 && showLoanPlayerModal}
    {@const selectedPlayer = filteredPlayers.find(x => x.id == selectedPlayerId) }
    <LoanPlayer visible={showLoanPlayerModal} {closeModal} selectedClubId={selectedPlayer ? selectedPlayer.clubId ?? 0 : 0} {selectedPlayerId} {selectedLeagueId}/>
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
    <TransferPlayer visible={showTransferPlayerModal} {closeModal} selectedClubId={selectedPlayer ? selectedPlayer.clubId ?? 0 : 0} {selectedPlayerId} {selectedLeagueId} />
{/if}