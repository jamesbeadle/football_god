<script lang="ts">
    import type { Writable } from "svelte/store";
    import { convertEvent } from "$lib/utils/helpers";
    import type { FixtureDTO, PlayerDTO, PlayerEventData } from "../../../../../declarations/data_canister/data_canister.did";

    export let selectedPlayers: Writable<PlayerDTO[]>;
    export let fixture: FixtureDTO;
    export let playerEventData: Writable<PlayerEventData[]>;
    export let view = "home";

    export let handleEditPlayerEvents: (player: PlayerDTO) => void;

</script>

{#each $selectedPlayers.filter((x) => x.clubId === ((view == "home") ? fixture.homeClubId : fixture?.awayClubId)) as player (player.id)}
    <div class="flex items-center p-2 justify-between py-4 border-b border-gray-700 cursor-pointer w-full">
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
            class="rounded brand-button px-3 sm:px-2 px-3 py-1 ml-1"
            >
            Update Events
            </button>
        </div>
        </div>
{/each}
{#if $selectedPlayers.filter((x) => x.clubId === ((view == "home") ? fixture.homeClubId : fixture?.awayClubId)).length == 0}
    <p class="p-4">No players selected.</p>
{/if}