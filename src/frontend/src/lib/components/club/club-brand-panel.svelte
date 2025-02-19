<script lang="ts">
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import ShirtIcon from "$lib/icons/ShirtIcon.svelte";
    import type { ClubDTO } from "../../../../../declarations/data_canister/data_canister.did";

    export let club: ClubDTO;
</script>

<div class="flex flex-col items-center flex-grow">
  <p class="content-panel-header">
    {club.friendlyName}
  </p>
  <div class="flex py-2 space-x-4">
    <BadgeIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} thirdColour={club.thirdColourHex} className="h-8" />
    <ShirtIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} thirdColour={club.thirdColourHex} className="h-8" />
  </div>
  <p class="content-panel-header">
    {club.abbreviatedName}
  </p>
</div>