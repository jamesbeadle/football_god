<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  
  import { clubStore } from "$lib/stores/club-store";
  import { leagueStore } from "$lib/stores/league-store";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import LocalSpinner from "../shared/local-spinner.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
  import type { ClubDTO, FootballLeagueDTO, LoanedPlayerDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import { playerStore } from "$lib/stores/player-store";
  import RecallPlayer from "../governance/player/recall-player.svelte";
    import DataRow from "../shared/data-row.svelte";
    import { formatUnixDateToReadable } from "$lib/utils/helpers";
  
  let isLoading = true;


  export let leagueId: number;
  let league: FootballLeagueDTO | undefined;
  let clubs: ClubDTO[] = [];
  let loanedPlayers: LoanedPlayerDTO[] = [];
  let selectedPlayerId: number = 0;

  let showRecallLoanModal = false;
  let dropdownVisible: number | null = null;
  
  onMount(async () => {
    try {
      let leagues = await leagueStore.getLeagues();
      league = leagues.find(x => x.id == leagueId);
      clubs = await clubStore.getClubs(leagueId);
      await getLoanedPlayers();
    } catch (error) {
      console.error("Error fetching league fixtures:", error);
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

  function toggleDropdown(fixtureId: number, event: MouseEvent) {
    event.stopPropagation();
    dropdownVisible = dropdownVisible === fixtureId ? null : fixtureId;
  }

  function handleClickOutside(event: MouseEvent) {
      const dropdownElements = document.querySelectorAll('.dropdown-menu');
      const targetElement = event.target as HTMLElement;

      if (![...dropdownElements].some(dropdown => dropdown.contains(targetElement))) {
          dropdownVisible = null;
      }
  }

  function loadRecallLoan(playerId: number) {
    selectedPlayerId = playerId;
    showRecallLoanModal = true;
  }

  function closeModal() {
    selectedPlayerId = 0;
    showRecallLoanModal = false;
  }

  async function getLoanedPlayers(){
    loanedPlayers = await playerStore.getLoanedPlayers(1);
  }
</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  
  <div class="flex w-full">
    <div class="w-full flex flex-col rounded-lg shadow-lg">
      
      {#if league}
      
        <div class="flex justify-between items-center w-full mb-4">
            <h1>{league.name} Loaned Players</h1>
        </div>
        
        <div class="space-y-4">
          {#if loanedPlayers}
              {#each loanedPlayers.sort((a, b) => Number(a.clubId) - Number(b.clubId)) as player}
                {@const club = clubs.find(x => x.id == player.clubId)}
                {@const parentClub = clubs.find(x => x.id == player.parentClubId)}
                <DataRow>
                  <div class="flex-1 truncate">
                    <div class="flex flex-col w-full">
                      <p>{player.firstName} {player.lastName}</p>
                      <p>Loan End Date: {formatUnixDateToReadable(Number(player.currentLoanEndDate))}</p>
                      <div class="flex flex-row w-full">
                        <div class="flex flex-col w-auto">
                          <p>Current Club:</p>
                          <span class="flex flex-row space-x-2">
                            <BadgeIcon primaryColour={club?.primaryColourHex} secondaryColour={club?.secondaryColourHex} className="w-6 h-6" />
                            <span class="text-white text-sm">{club?.friendlyName}</span>  
                          </span>
                        </div>
                        <div class="flex flex-col w-auto">
                          <p>Parent Club:</p>
                          <span class="flex flex-row space-x-2">
                            <BadgeIcon primaryColour={parentClub?.primaryColourHex} secondaryColour={parentClub?.secondaryColourHex} className="w-6 h-6" />
                            <span class="text-white text-sm">{parentClub?.friendlyName}</span>  
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ml-2 flex-shrink-0">
                    <button
                      class="p-2"
                      on:click={(event) => toggleDropdown(player.id, event)}
                    >
                      <PipsIcon className="w-6" />
                    </button>
                    {#if dropdownVisible === player.id}
                      <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button class="dropdown-link" on:click={() => loadRecallLoan(player.id)}>Recall Loan</button>
                      </div>
                    {/if}
                  </div>              
                </DataRow>
              {/each}
          {/if}
        </div>

      {/if}
    </div>
  </div>

  {#if selectedPlayerId > 0 && showRecallLoanModal}
    <RecallPlayer visible={showRecallLoanModal} {closeModal} selectedPlayer={loanedPlayers.find(x=>x.id == selectedPlayerId)!} />
  {/if}

{/if}
