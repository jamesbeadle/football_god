<script lang="ts">
    import { adminStore } from "$lib/stores/admin.store";
    import { onMount } from "svelte";
    import type { Euro2024EventDTO, Euro2024EventId } from "../../../../../declarations/football_god_backend/football_god_backend.did";
    import AddEuro2024Event from "./add_euro2024_event.svelte";
    import ConfirmDeleteEvent from "./confirm_delete_event.svelte";

    let events: Euro2024EventDTO[] = [];
    let showAddEventModal = false;
    let showDeleteConfirm = false;
    let selectedEventId: bigint = -1n;

    onMount(async () => {
        events = await adminStore.getEuro2024Events();
        console.log(events)
    });

    async function handleAddEvent(){
        showAddEventModal = true;
    };
    
    async function confirmAddEvent(dto: Euro2024EventDTO){
        adminStore.addEuro2024Event(dto);
    };

    

    
    async function handleHideAddEvent(){
        selectedEventId = -1n;
        showAddEventModal = false;
    };

    function handleHideDeleteConfirm(){
        selectedEventId = -1n;
        showDeleteConfirm = false;
    }

    async function confirmDeleteEvent(){
        //TODO SHOW Loading spinner and try catch

        let result = await adminStore.deleteEuro2024Event(selectedEventId);
        events = await adminStore.getEuro2024Events();
        selectedEventId = -1n;
        showDeleteConfirm = false;
    };

    async function deleteEvent(eventId: Euro2024EventId){
        let result = await adminStore.deleteEuro2024Event(eventId);
        console.log("delete event");
        console.log(result);
    };

</script>

{#if showAddEventModal}
    <AddEuro2024Event onConfirm={confirmAddEvent} onClose={handleHideAddEvent} visible={showAddEventModal} />
{/if}
{#if showDeleteConfirm}
    <ConfirmDeleteEvent onConfirm={confirmDeleteEvent} onClose={handleHideDeleteConfirm} visible={showDeleteConfirm} eventId={selectedEventId} />
{/if}
<div class="p-4">
    <div class="flex">
        <button on:click={handleAddEvent}>Add Event</button>
    </div>
    <div class="overflow-x-auto flex-1">
        <div
          class="flex justify-between border border-gray-700 py-2 bg-light-gray border-b border-gray-700"
        >
          <div class="w-1/12"></div>
          <div class="w-2/12">Stage</div>
          <div class="w-3/12">Fixture</div>
          <div class="w-2/12">Event Type</div>
          <div class="w-3/12">Event Detail</div>
          <div class="w-1/12"></div>
        </div>
    
        {#each events as event, index}
          <div
            class="flex items-center justify-between py-2 border-b border-gray-700 cursor-pointer"
          >
            <div class="w-6/12">
                {index}
            </div>
            <div class="w-6/12">
                {event.stage}
            </div>
            <div class="w-6/12">
                {event.fixtureId}
            </div>
            <div class="w-6/12">
                {event.eventType}
            </div>
            <div class="w-6/12">
                {event.playerId} or {event.fixtureId}
            </div>

            <div class="w-3/12">
                <button on:click={() => deleteEvent(event.eventId)}>Delete</button>
            </div>
          </div>
        {/each}
    </div>
</div>
