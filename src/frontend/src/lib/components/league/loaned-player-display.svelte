<script lang="ts">
  import type { ClubDTO, LoanedPlayerDTO } from "../../../../../declarations/data_canister/data_canister.did";
  import { formatUnixDateToReadableNumber, formatUnixDateToSmallReadableDate } from "$lib/utils/helpers";
  import PlayerDisplay from "../player/player-display.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";

  export let player: LoanedPlayerDTO;
  export let currentClub: ClubDTO;
  export let parentClub: ClubDTO;
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
  <div class="flex flex-col" slot="additional-info">
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
    <div class="flex flex-col">
      <span class="text-xs text-white">Parent Club</span>
      <span class="text-sm font-medium text-white">{parentClub.friendlyName}</span>
    </div>
  </div>
</PlayerDisplay> 