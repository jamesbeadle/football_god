<script lang="ts">
  import type { Club, Fixture } from "../../../../../declarations/backend/backend.did";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import PipsIcon from "$lib/icons/pips-icon.svelte";
    import { convertDateToReadable } from "$lib/utils/helpers";

  interface Props {
    fixture: Fixture;
    homeClub: Club;
    awayClub: Club;
    onDropdownClick: ((fixtureId: number, event: MouseEvent) => void) | undefined;
    dropdownVisible: number | null;
    onAddFixtureData: ((fixtureId: number) => void) | undefined;
    onMoveFixture: ((fixtureId: number) => void) | undefined;
    onPostponeFixture: ((fixtureId: number) => void) | undefined;
  }

  let { fixture, homeClub, awayClub, onDropdownClick, dropdownVisible, onAddFixtureData, onMoveFixture, onPostponeFixture }: Props = $props();

  let isFinalised = $state(false);
  $effect(() => { isFinalised = Object.keys(fixture.status)[0] === "Finalised"; });

  let hasDropdownOptions = $state(false);
  $effect(() => { onDropdownClick && (onAddFixtureData || onMoveFixture || onPostponeFixture) });


</script>

<div class="relative stacked-col w-full px-3 py-4 mb-4 border rounded-lg shadow-lg border-BrandPurple/50 md:mb-0 md:px-0 bg-BrandGray">
  <div class="flex flex-row items-center justify-between">
    <div class="stacked-col w-full space-y-4">
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center flex-1">
          <BadgeIcon primaryColour={homeClub?.primaryColourHex} secondaryColour={homeClub?.secondaryColourHex} thirdColour={homeClub?.thirdColourHex} className="h-6 mr-2 ml-4" />
          <span class="text-sm text-white">{homeClub?.friendlyName}</span>
        </div>
        {#if isFinalised}
          <span class="w-8 mr-4 text-sm text-center text-white">{fixture.homeGoals}</span>
        {/if}
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center flex-1">
          <BadgeIcon primaryColour={awayClub?.primaryColourHex} secondaryColour={awayClub?.secondaryColourHex} thirdColour={awayClub?.thirdColourHex} className="h-6 mr-2 ml-4" />
          <span class="text-sm text-white">{awayClub?.friendlyName}</span>
        </div>
        {#if isFinalised}
          <span class="w-8 mr-4 text-sm text-center text-white">{fixture.awayGoals}</span>
        {/if}
        <p>{convertDateToReadable(Number(fixture.kickOff))}</p>
      </div>
    </div>

    {#if hasDropdownOptions}
      <div class="relative flex items-center">
        <button
          class="p-2 text-white"
          onclick={(event) => onDropdownClick?.(fixture.id, event)}
        >
          <PipsIcon fill="white" className="w-6" />
        </button>
        {#if dropdownVisible === fixture.id}
          <div class="absolute right-0 z-10 w-48 mt-2 rounded-md shadow-lg bg-BrandGray">
            {#if onAddFixtureData}
              <button class="dropdown-link" onclick={() => onAddFixtureData(fixture.id)}>Add Fixture Data</button>
            {/if}
            {#if onMoveFixture}
              <button class="dropdown-link" onclick={() => onMoveFixture(fixture.id)}>Move Fixture</button>
            {/if}
            {#if onPostponeFixture}
              <button class="dropdown-link" onclick={() => onPostponeFixture(fixture.id)}>Postpone Fixture</button>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
