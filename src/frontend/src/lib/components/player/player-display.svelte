<script lang="ts">
  import { getFlagComponent, calculateAgeFromNanoseconds } from "$lib/utils/helpers";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
    import type { Club, Player } from "../../../../../declarations/backend/backend.did";

  export let player: Player;
  export let club: Club;
  export let onDropdownClick: (playerId: number, event: MouseEvent) => void;
  export let dropdownVisible: number | null;
  
  export let onUpdatePlayer: ((playerId: number) => void) | undefined = undefined;
  export let onSetPlayerInjury: ((playerId: number) => void) | undefined = undefined;
  export let onTransferPlayer: ((playerId: number) => void) | undefined = undefined;
  export let onLoanPlayer: ((playerId: number) => void) | undefined = undefined;
  export let onRecallPlayer: ((playerId: number) => void) | undefined = undefined;
  export let onRevaluePlayerUp: ((playerId: number) => void) | undefined = undefined;
  export let onRevaluePlayerDown: ((playerId: number) => void) | undefined = undefined;
  export let onRetirePlayer: ((playerId: number) => void) | undefined = undefined;
  export let onUnretirePlayer: ((playerId: number) => void) | undefined = undefined;
  export let onSetFreeAgent: ((playerId: number) => void) | undefined = undefined;

  $: FlagIcon = getFlagComponent(player.nationality);
  $: age = calculateAgeFromNanoseconds(Number(player.dateOfBirth));
  $: hasDropdownOptions = onUpdatePlayer || onSetPlayerInjury || onTransferPlayer || onLoanPlayer || onRecallPlayer || onRevaluePlayerUp || onRevaluePlayerDown || onRetirePlayer || onUnretirePlayer || onSetFreeAgent;
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
                        <svelte:component this={FlagIcon} className="w-6 h-6" />
                    </div>
                    <div class="items-center hidden gap-2 xxs:flex">
                        <h3 class="text-xl font-semibold text-white">{player.firstName} {player.lastName}</h3>
                        <svelte:component this={FlagIcon} className="w-6 h-6" />
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
                <slot name="additional-info" />
                </div>
            </div>
        
            <div class="stacked-column md:flex-row md:items-center md:gap-12">
                <div class="flex items-center gap-3">
                <BadgeIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} className="w-8 h-8" />
                <div class="stacked-column">
                    <span class="text-xs text-white">Club</span>
                    <span class="text-sm font-medium text-white">{club.friendlyName}</span>
                </div>
                </div>
                <slot name="additional-club-info" />
            </div>
        </div>
        {#if hasDropdownOptions}
            <div class="relative flex items-center">
                <button
                    class="p-2 text-white"
                    on:click={(event) => onDropdownClick(player.id, event)}
                    >
                    <PipsIcon className="w-6" />
                </button>
                {#if dropdownVisible === player.id}
                    <div class="absolute right-0 z-10 w-48 mt-2 rounded-lg shadow-lg bg-BrandGray">
                        {#if onUpdatePlayer}
                            <button class="dropdown-link" on:click={() => onUpdatePlayer(player.id)}>
                                Update Player
                            </button>
                        {/if}
                        {#if onSetPlayerInjury}
                            <button class="dropdown-link" on:click={() => onSetPlayerInjury(player.id)}>
                                Set Player Injury
                            </button>
                        {/if}
                        {#if onTransferPlayer}
                            <button class="dropdown-link" on:click={() => onTransferPlayer(player.id)}>
                                Transfer Player
                            </button>
                        {/if}
                        {#if onLoanPlayer}
                            <button class="dropdown-link" on:click={() => onLoanPlayer(player.id)}>
                                Loan Player
                            </button>
                        {/if}
                        {#if onRecallPlayer}
                            <button class="dropdown-link" on:click={() => onRecallPlayer(player.id)}>
                                Recall Player
                            </button>
                        {/if}
                        {#if onRevaluePlayerUp}
                            <button class="dropdown-link" on:click={() => onRevaluePlayerUp(player.id)}>
                                Revalue Player Up
                            </button>
                        {/if}
                        {#if onRevaluePlayerDown}
                            <button class="dropdown-link" on:click={() => onRevaluePlayerDown(player.id)}>
                                Revalue Player Down
                            </button>
                        {/if}
                        {#if onRetirePlayer}
                            <button class="dropdown-link" on:click={() => onRetirePlayer(player.id)}>
                                Retire Player
                            </button>
                        {/if}
                        {#if onUnretirePlayer}  
                            <button class="dropdown-link" on:click={() => onUnretirePlayer(player.id)}>
                                Unretire Player
                            </button>
                        {/if}
                        {#if onSetFreeAgent}
                            <button class="dropdown-link" on:click={() => onSetFreeAgent(player.id)}>
                                Set Free Agent  
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div> 