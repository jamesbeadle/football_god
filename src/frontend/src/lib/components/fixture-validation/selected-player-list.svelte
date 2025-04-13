<script lang="ts">
    import type { Writable } from "svelte/store";
    import { convertEvent } from "$lib/utils/helpers";
    import type { Fixture, Player, PlayerEventData } from "../../../../../declarations/backend/backend.did";
   
    export let selectedPlayers: Writable<Player[]>;
    export let fixture: Fixture;
    export let playerEventData: Writable<PlayerEventData[]>;
    export let view = "home";

    export let handleEditPlayerEvents: (player: Player) => void;

    function getEventName(eventType: any): string {
        if ("Goal" in eventType) return "Goal";
        if ("GoalAssisted" in eventType) return "Assist";
        if ("OwnGoal" in eventType) return "Own Goal";
        if ("PenaltySaved" in eventType) return "Penalty Save";
        if ("PenaltyMissed" in eventType) return "Penalty Miss";
        if ("YellowCard" in eventType) return "Yellow Card";
        if ("RedCard" in eventType) return "Red Card";
        return "";
    }
</script>

{#each $selectedPlayers.filter((x) => x.clubId === ((view == "home") ? fixture.homeClubId : fixture?.awayClubId)) as player (player.id)}
    <div class="stacked-column w-full border-b border-gray-700 cursor-pointer">
        <div class="flex items-center justify-between p-4">
            <div class="w-1/6 px-4">
                {`${ player.firstName.length > 0 ? player.firstName.charAt(0) + "." : "" } ${player.lastName}`}
            </div>

            {#if Object.keys(player.position)[0] == "Goalkeeper"}
                <div class="w-1/6 px-4">GK</div>
            {/if}
            {#if Object.keys(player.position)[0] == "Defender"}
                <div class="w-1/6 px-4">DF</div>
            {/if}
            {#if Object.keys(player.position)[0] == "Midfielder"}
                <div class="w-1/6 px-4">MF</div>
            {/if}
            {#if Object.keys(player.position)[0] == "Forward"}
                <div class="w-1/6 px-4">FW</div>
            {/if}
            <div class="w-1/6 px-4">
                Events:
                {$playerEventData?.length > 0 &&
                $playerEventData?.filter((e) => e.playerId === player.id)
                .length
                ? $playerEventData?.filter((e) => e.playerId === player.id)
                    .length
                : 0}
            </div>
            <div class="w-1/6 px-4">
                {$playerEventData &&
                $playerEventData?.length > 0 &&
                $playerEventData?.find(
                (e) =>
                    e.playerId === player.id && convertEvent(e.eventType) == 0
                )
                ? $playerEventData?.find((e) => e.playerId === player.id)
                    ?.eventStartMinute
                : "-"}
            </div>
            <div class="w-1/6 px-4">
                {$playerEventData &&
                $playerEventData?.length > 0 &&
                $playerEventData?.find(
                (e) =>
                    e.playerId === player.id && convertEvent(e.eventType) == 0
                )
                ? $playerEventData?.find((e) => e.playerId === player.id)
                    ?.eventEndMinute
                : "-"}
            </div>
            <div class="w-1/6 px-4">
                <button
                on:click={() => handleEditPlayerEvents(player)}
                class="px-3 py-1 ml-1 rounded brand-button sm:px-2"
                >
                Update Events
                </button>
            </div>
        </div>
        {#if $playerEventData?.filter(e => e.playerId === player.id).length > 0}
            <div class="flex flex-wrap gap-2 px-4 pb-4">
                {#if $playerEventData.filter(e => e.playerId === player.id && "KeeperSave" in e.eventType).length > 0}
                    <div class="items-center inline-block px-3 py-1 text-sm font-medium text-white rounded-lg bg-BrandPurple/50 hover:bg-BrandPurple/70">
                        {$playerEventData.filter(e => e.playerId === player.id && "KeeperSave" in e.eventType).length} Keeper Saves
                        <button 
                                class="items-center p-1 text-gray-400 hover:text-white" 
                                on:click|stopPropagation={() => {
                                    playerEventData.update(events => 
                                        events.filter(e => e.playerId !== player.id)
                                    );
                                }}
                            >
                                x
                            </button>
                    </div>
                {/if}
                {#each $playerEventData.filter(e => e.playerId === player.id).sort((a, b) => a.eventStartMinute - b.eventStartMinute) as event}
                    {#if getEventName(event.eventType) !== ""}
                        <div class="items-center inline-block px-3 py-1 text-sm font-medium text-white rounded-lg bg-BrandPurple/50 hover:bg-BrandPurple/70">
                            {event.eventStartMinute}{event.eventStartMinute == 1 ? "st" : event.eventStartMinute == 2 ? "nd" : event.eventStartMinute == 3 ? "rd" : "th"} Min {getEventName(event.eventType)}
                            {#if "RedCard" in event.eventType && $playerEventData.filter(e => 
                                e.playerId === player.id && 
                                "YellowCard" in e.eventType
                            ).length === 2}
                                (Two Yellows)
                            {/if}
                            <button 
                                class="items-center p-1 text-gray-400 hover:text-white" 
                                on:click|stopPropagation={() => {
                                    playerEventData.update(events => 
                                        events.filter(e => e !== event)
                                    );
                                }}
                            >
                                x
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
{/each}
{#if $selectedPlayers.filter((x) => x.clubId === ((view == "home") ? fixture.homeClubId : fixture?.awayClubId)).length == 0}
    <p class="p-4">No players selected.</p>
{/if}