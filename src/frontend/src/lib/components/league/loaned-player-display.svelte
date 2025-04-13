<script lang="ts">
  import { formatUnixDateToReadableNumber, formatUnixDateToSmallReadableDate } from "$lib/utils/helpers";
  import PlayerDisplay from "../player/player-display.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import type { Club, Player } from "../../../../../declarations/backend/backend.did";

  export let player: Player;
  export let currentClub: Club;
  export let parentClub: Club;
  export let onDropdownClick: (playerId: number, event: MouseEvent) => void;
  export let dropdownVisible: number | null;
  export let onRecallLoan: ((playerId: number) => void) | undefined = undefined;
</script>

<PlayerDisplay
  {player}
  club={currentClub}
  {dropdownVisible}
  {onDropdownClick}
  onRecallPlayer={onRecallLoan}
>
  <div class="stacked-col" slot="additional-info">
    <span class="text-xs text-white">Loan Expires</span>
    <span class="text-sm font-medium text-white md:hidden">
      {formatUnixDateToSmallReadableDate(player.currentLoanEndDate)}
    </span>
    <span class="hidden text-sm font-medium text-white md:block">
      {formatUnixDateToReadableNumber(Number(player.currentLoanEndDate))}
    </span>
  </div>

  <div class="flex items-center gap-3 mt-4 md:mt-0" slot="additional-club-info">
    <BadgeIcon primaryColour={parentClub.primaryColourHex} secondaryColour={parentClub.secondaryColourHex} className="w-8 h-8" />
    <div class="stacked-col">
      <span class="text-xs text-white">Parent Club</span>
      <span class="text-sm font-medium text-white">{parentClub.friendlyName}</span>
    </div>
  </div>
</PlayerDisplay> 