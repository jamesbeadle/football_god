<script lang="ts">
  import type { Club, Player } from "../../../../../../declarations/backend/backend.did";
  import PlayerDisplay from "$lib/components/player/player-display.svelte";

  interface Props {
    players: Player[];
    clubs: Club[];
  }

  let { players, clubs }: Props = $props();
  let sortedPlayers = $derived(
    [...players].sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions)
  );
</script>

<div class="px-3 mt-4 mb-4 space-y-4 md:px-0">
  {#each sortedPlayers as player}
    {@const playerClub = clubs.find((x) => x.id == player.clubId)}
    {#if playerClub}
      <PlayerDisplay {player} club={playerClub} />
    {/if}
  {/each}
</div>