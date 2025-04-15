<script lang="ts">


    /* ----- Backend Imports ----- */

    import type { Club, Player } from "../../../../../declarations/backend/backend.did";


    /* ----- Helpers ----- */

    import { calculateAgeFromNanoseconds, getFlagComponent } from "$lib/utils/helpers";


    /* ----- Component Imports ----- */

    import UpdatePlayer from "$lib/components/governance/proposals/player/update-player.svelte";
    import TransferPlayer from "$lib/components/governance/proposals/player/transfer-player.svelte";
    import LoanPlayer from "$lib/components/governance/proposals/player/loan-player.svelte";
    import SetFreeAgent from "$lib/components/governance/proposals/player/set-free-agent.svelte";
    import RecallPlayer from "$lib/components/governance/proposals/player/recall-player.svelte";
    import RevaluePlayerDown from "$lib/components/governance/proposals/player/revalue-player-down.svelte";
    import RevaluePlayerUp from "$lib/components/governance/proposals/player/revalue-player-up.svelte";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import PipsIcon from "$lib/icons/pips-icon.svelte";


    /* ----- Component Properties ----- */

    interface Props {
        player: Player;
        club: Club;
    }
    let { player, club }: Props = $props();



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




    let age = $state(0);

    $effect(() => { age = calculateAgeFromNanoseconds(Number(player.dateOfBirth)) })
    
    /* ----- Modal Load Flags ----- */

    let showTransferPlayerModal = $state(false);
    let showLoanPlayerModal = $state(false);
    let showRecallPlayerModal = $state(false);
    let showRevaluePlayerUpModal = $state(false);
    let showRevaluePlayerDownModal = $state(false);
    let showRetirePlayerModal = $state(false);
    let showUnretirePlayerModal = $state(false);
    let showCreatePlayerModal = $state(false);
    let showUpdatePlayerModal = $state(false);
    let showSetPlayerInjuryModal = $state(false);
    let showSetFreeAgentModal = $state(false);
    let dropdownVisible: number | null = $state(null);


    /* ----- Toggle Modal Functions ----- */
  
    function loadUpdatePlayer(){
        showUpdatePlayerModal = true;
    }
  
    function loadSetPlayerInjury(){
        showSetPlayerInjuryModal = true;
    }
  
    function loadTransferPlayer(){
        showTransferPlayerModal = true;
    }
  
    function loadLoanPlayer(){
        showLoanPlayerModal = true;
    }
  
    function loadRecallPlayer(){
        showRecallPlayerModal = true;
    }
  
    function loadRevaluePlayerUp(){
        showRevaluePlayerUpModal = true;
    }
  
    function loadRevaluePlayerDown(){
        showRevaluePlayerDownModal = true;
    }
  
    function loadRetirePlayer(){
        showRetirePlayerModal = true;
    }
  
    function loadUnretirePlayer(){
        showUnretirePlayerModal = true;
    }
  
    function loadSetFreeAgent() {
        showSetFreeAgentModal = true;
    }
  
    function closeModal(){
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

    function onDropdownClick(playerId: number, event: MouseEvent) {
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


</script>

<div class="relative stacked-col w-full px-4 py-4 mb-4 border rounded-lg shadow-lg border-BrandPurple/50 md:mb-0 bg-BrandGray">
    <div class="flex flex-row items-start justify-between">
        <div class="stacked-col flex-1 min-w-0 space-y-4">
            <div>
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0 xxs:hidden">
                        <h3 class="text-xl font-semibold text-white break-words">{player.firstName} {player.lastName}</h3>
                    </div>
                    <div class="flex-shrink-0 mt-1 xxs:hidden">
                        {#if player.nationality > 0}
                            {@const flag = getFlagComponent(player.nationality)}
                            <flag class="w-6 h-6"></flag>
                        {/if}
                    </div>
                    <div class="items-center hidden gap-2 xxs:flex">
                        <h3 class="text-xl font-semibold text-white">{player.firstName} {player.lastName}</h3>
                    </div>
                </div>

                <div class="flex flex-row gap-4 mt-2">
                <div class="stacked-col">
                    <span class="text-xs text-white">Value</span>
                    <span class="text-sm font-medium text-white">£{player.valueQuarterMillions / 4}M</span>
                </div>
                <div class="stacked-col">
                    <span class="text-xs text-white">Position</span>
                    <span class="text-sm font-medium text-white">{Object.keys(player.position)[0]}</span>
                </div>
                <div class="stacked-column">
                    <span class="text-xs text-white">Age</span>
                    <span class="text-sm font-medium text-white">{age}</span>
                </div>
                </div>
            </div>
        
            <div class="stacked-column md:flex-row md:items-center md:gap-12">
                <div class="flex items-center gap-3">
                <BadgeIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} thirdColour={club.thirdColourHex} className="w-8 h-8" />
                <div class="stacked-column">
                    <span class="text-xs text-white">Club</span>
                    <span class="text-sm font-medium text-white">{club.friendlyName}</span>
                </div>
                </div>
            </div>
        </div>
        <div class="relative flex items-center">
            <button
                class="p-2 text-white"
                onclick={(event) => onDropdownClick(player.id, event)}
                >
                <PipsIcon fill='white' className="w-6" />
            </button>
            {#if dropdownVisible === player.id}
                <div class="absolute right-0 z-10 w-48 mt-2 rounded-lg shadow-lg bg-BrandGray">
                    <button class="dropdown-link" onclick={() => loadUpdatePlayer()}>
                        Update Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadSetPlayerInjury()}>
                        Set Player Injury
                    </button>
                    <button class="dropdown-link" onclick={() => loadTransferPlayer()}>
                        Transfer Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadLoanPlayer()}>
                        Loan Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadRecallPlayer()}>
                        Recall Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadRevaluePlayerUp()}>
                        Revalue Player Up
                    </button>
                    <button class="dropdown-link" onclick={() => loadRevaluePlayerDown()}>
                        Revalue Player Down
                    </button>
                    <button class="dropdown-link" onclick={() => loadRetirePlayer()}>
                        Retire Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadUnretirePlayer()}>
                        Unretire Player
                    </button>
                    <button class="dropdown-link" onclick={() => loadSetFreeAgent()}>
                        Set Free Agent  
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div> 

{#if player && showLoanPlayerModal}
    <LoanPlayer visible={showLoanPlayerModal} {closeModal} selectedPlayer={player} />
{/if}

{#if player && showUpdatePlayerModal}
    <UpdatePlayer visible={showUpdatePlayerModal} {closeModal} selectedPlayer={player} />
{/if}

{#if player && showTransferPlayerModal}
    <TransferPlayer visible={showTransferPlayerModal} {closeModal} selectedPlayer={player} />
{/if}

{#if player && showRecallPlayerModal}
    <RecallPlayer visible={showRecallPlayerModal} {closeModal} selectedPlayer={player} />
{/if}

{#if player && showSetFreeAgentModal}
    <SetFreeAgent visible={showSetFreeAgentModal} {closeModal} selectedPlayer={player} />
{/if}

{#if player && showRevaluePlayerUpModal}
    <RevaluePlayerUp visible={showRevaluePlayerUpModal} {closeModal} club={club} selectedPlayer={player} />
{/if}

{#if player && showRevaluePlayerDownModal}
    <RevaluePlayerDown visible={showRevaluePlayerDownModal} {closeModal} club={club} player={player} />
{/if}