<script lang="ts">
  import type { Club, Player } from "../../../../../../declarations/backend/backend.did";
  import PlayerDisplay from "$lib/components/player/player-display.svelte";
    
  interface Props {
    players: Player[];
    clubs: Club[];
  }

  let sortedPlayers: Player[] = $state([]);
  
  let { players, clubs }: Props = $props();
  $effect(() => {
    console.log('players table updated')
    console.log(players.length)
    sortedPlayers =  [...players].sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions)
  });

</script>

<div class="px-3 mt-4 mb-4 space-y-4 md:px-0">
  {#each sortedPlayers as player}
    {@const playerClub = clubs.find(x => x.id == player.clubId)}
    <PlayerDisplay {player} club={playerClub!} />
  {/each}
</div>