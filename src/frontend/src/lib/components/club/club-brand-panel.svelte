<script lang="ts">
    import type { Club } from "../../../../../declarations/backend/backend.did";

    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import ShirtIcon from "$lib/icons/ShirtIcon.svelte";
    
    export let club: Club;
</script>

<div class="stacked-column items-center">
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