<script lang="ts">
    import type { Club } from "../../../../../declarations/backend/backend.did";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import ShirtIcon from "$lib/icons/ShirtIcon.svelte";
    
    interface Props {
      club: Club;
    }
    let { club }: Props = $props();
    
</script>

<div class="stacked-column items-center">
  <p class="page-sub-title">
    {club.friendlyName}
  </p>
  <div class="stacked-column">
    <BadgeIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} thirdColour={club.thirdColourHex} className="h-8" />
    <ShirtIcon primaryColour={club.primaryColourHex} secondaryColour={club.secondaryColourHex} thirdColour={club.thirdColourHex} className="h-8" />
  </div>
  <p class="page-sub-title">
    {club.abbreviatedName}
  </p>
</div>