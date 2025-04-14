<script lang="ts">
    import { calculateAgeFromNanoseconds, getFlagComponent } from "$lib/utils/helpers";
    import type { Club, Player } from "../../../../../declarations/backend/backend.did";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import PipsIcon from "$lib/icons/pips-icon.svelte";

    interface Props {
        player: Player;
        club: Club;
        onDropdownClick: (playerId: number, event: MouseEvent) => void;
        dropdownVisible: number | null;
        onUpdatePlayer: ((playerId: number) => void) | undefined;
        onSetPlayerInjury: ((playerId: number) => void) | undefined;
        onTransferPlayer: ((playerId: number) => void) | undefined;
        onLoanPlayer: ((playerId: number) => void) | undefined;
        onRecallPlayer: ((playerId: number) => void) | undefined;
        onRevaluePlayerUp: ((playerId: number) => void) | undefined;
        onRevaluePlayerDown: ((playerId: number) => void) | undefined;
        onRetirePlayer: ((playerId: number) => void) | undefined;
        onUnretirePlayer: ((playerId: number) => void) | undefined;
        onSetFreeAgent: ((playerId: number) => void) | undefined;
    }
    let { player, club, onDropdownClick, dropdownVisible, onUpdatePlayer, onSetPlayerInjury, onTransferPlayer, onLoanPlayer, onRecallPlayer, onRevaluePlayerUp, onRevaluePlayerDown, onRetirePlayer, onUnretirePlayer, onSetFreeAgent }: Props = $props();

    let age = $state(0);

    $effect(() => { age = calculateAgeFromNanoseconds(Number(player.dateOfBirth)) })
    

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
                    {#if onUpdatePlayer}
                        <button class="dropdown-link" onclick={() => onUpdatePlayer(player.id)}>
                            Update Player
                        </button>
                    {/if}
                    {#if onSetPlayerInjury}
                        <button class="dropdown-link" onclick={() => onSetPlayerInjury(player.id)}>
                            Set Player Injury
                        </button>
                    {/if}
                    {#if onTransferPlayer}
                        <button class="dropdown-link" onclick={() => onTransferPlayer(player.id)}>
                            Transfer Player
                        </button>
                    {/if}
                    {#if onLoanPlayer}
                        <button class="dropdown-link" onclick={() => onLoanPlayer(player.id)}>
                            Loan Player
                        </button>
                    {/if}
                    {#if onRecallPlayer}
                        <button class="dropdown-link" onclick={() => onRecallPlayer(player.id)}>
                            Recall Player
                        </button>
                    {/if}
                    {#if onRevaluePlayerUp}
                        <button class="dropdown-link" onclick={() => onRevaluePlayerUp(player.id)}>
                            Revalue Player Up
                        </button>
                    {/if}
                    {#if onRevaluePlayerDown}
                        <button class="dropdown-link" onclick={() => onRevaluePlayerDown(player.id)}>
                            Revalue Player Down
                        </button>
                    {/if}
                    {#if onRetirePlayer}
                        <button class="dropdown-link" onclick={() => onRetirePlayer(player.id)}>
                            Retire Player
                        </button>
                    {/if}
                    {#if onUnretirePlayer}  
                        <button class="dropdown-link" onclick={() => onUnretirePlayer(player.id)}>
                            Unretire Player
                        </button>
                    {/if}
                    {#if onSetFreeAgent}
                        <button class="dropdown-link" onclick={() => onSetFreeAgent(player.id)}>
                            Set Free Agent  
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div> 