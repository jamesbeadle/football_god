<script lang="ts">
  import type { ClubDTO, FixtureDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
  
  export let fixture: FixtureDTO;
  export let homeClub: ClubDTO;
  export let awayClub: ClubDTO;
  export let onDropdownClick: ((fixtureId: number, event: MouseEvent) => void) | undefined = undefined;
  export let dropdownVisible: number | null = null;
  export let onAddFixtureData: ((fixtureId: number) => void) | undefined = undefined;
  export let onMoveFixture: ((fixtureId: number) => void) | undefined = undefined;
  export let onPostponeFixture: ((fixtureId: number) => void) | undefined = undefined;
  export let onRescheduleFixture: ((fixtureId: number) => void) | undefined = undefined;

  $: isFinalized = Object.keys(fixture.status)[0] === "Finalised";
  $: hasDropdownOptions = onDropdownClick && (onAddFixtureData || onMoveFixture || onPostponeFixture || onRescheduleFixture);
</script>

<div class="relative flex flex-col w-full px-3 py-4 mb-4 border rounded-lg shadow-lg border-BrandPurple/50 md:mb-0 md:px-0 bg-BrandGray">
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-col w-full space-y-4">
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center flex-1">
          <BadgeIcon primaryColour={homeClub?.primaryColourHex} secondaryColour={homeClub?.secondaryColourHex} className="h-6 mr-2 ml-4" />
          <span class="text-sm text-white">{homeClub?.friendlyName}</span>
        </div>
        {#if isFinalized}
          <span class="w-8 mr-4 text-sm text-center text-white">{fixture.homeGoals}</span>
        {/if}
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center flex-1">
          <BadgeIcon primaryColour={awayClub?.primaryColourHex} secondaryColour={awayClub?.secondaryColourHex} className="h-6 mr-2 ml-4" />
          <span class="text-sm text-white">{awayClub?.friendlyName}</span>
        </div>
        {#if isFinalized}
          <span class="w-8 mr-4 text-sm text-center text-white">{fixture.awayGoals}</span>
        {/if}
      </div>
    </div>

    {#if hasDropdownOptions}
      <div class="relative flex items-center">
        <button
          class="p-2 text-white"
          on:click={(event) => onDropdownClick?.(fixture.id, event)}
        >
          <PipsIcon className="w-6" />
        </button>
        {#if dropdownVisible === fixture.id}
          <div class="absolute right-0 z-10 w-48 mt-2 rounded-md shadow-lg bg-BrandGray">
            {#if onAddFixtureData}
              <button class="dropdown-link" on:click={() => onAddFixtureData(fixture.id)}>Add Fixture Data</button>
            {/if}
            {#if onMoveFixture}
              <button class="dropdown-link" on:click={() => onMoveFixture(fixture.id)}>Move Fixture</button>
            {/if}
            {#if onPostponeFixture}
              <button class="dropdown-link" on:click={() => onPostponeFixture(fixture.id)}>Postpone Fixture</button>
            {/if}
            {#if onRescheduleFixture}
              <button class="dropdown-link" on:click={() => onRescheduleFixture(fixture.id)}>Reschedule Fixture</button>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
