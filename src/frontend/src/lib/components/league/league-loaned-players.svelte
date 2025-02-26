<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  
  import { clubStore } from "$lib/stores/club-store";
  import { leagueStore } from "$lib/stores/league-store";
  import type { ClubDTO, FootballLeagueDTO, LoanedPlayerDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import { playerStore } from "$lib/stores/player-store";

  import LocalSpinner from "../shared/local-spinner.svelte";
  import RecallPlayer from "../governance/player/recall-player.svelte";
  import LoanedPlayerDisplay from "./loaned-player-display.svelte";
  
  export let leagueId: number;

  let isLoading = true;

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
      loanedPlayers = await playerStore.getLoanedPlayers(leagueId);
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

</script>

{#if isLoading}
  <LocalSpinner />
{:else}
  
  <div class="flex w-full">
    <div class="flex flex-col w-full rounded-lg shadow-lg">
      {#if league}      
        <div class="flex items-center justify-between w-full mb-6">
          <p class="px-4 md:px-2">{league.name} Loaned Players</p>
        </div>
        
        <div class="px-3 mb-4 space-y-4 md:px-0">
          {#if loanedPlayers}
            {#each loanedPlayers.sort((a, b) => Number(a.clubId) - Number(b.clubId)) as player}
              {@const currentClub = clubs.find(x => x.id == player.clubId)}
              {@const parentClub = clubs.find(x => x.id == player.parentClubId)}
              <LoanedPlayerDisplay
                {player}
                currentClub={currentClub!}
                parentClub={parentClub!}
                {dropdownVisible}
                onDropdownClick={toggleDropdown}
                onRecallLoan={loadRecallLoan}
              />
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
