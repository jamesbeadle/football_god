<script lang="ts">
    import { onMount } from "svelte";
    import {
      calculateAgeFromNanoseconds,
      convertPositionToIndex,
      getPositionAbbreviation
    } from "../../utils/helpers";
    import { playerStore } from "$lib/stores/player-store";
    import { writable } from "svelte/store";
    import PositionFilter from "../../components/shared/position-filter.svelte";
    import { page } from "$app/stores";
    import type { Club, Player } from "../../../../../declarations/backend/backend.did";
    import PlayersTableHeader from "../shared/players-table-header.svelte";
  
    
    interface Props {
      club: Club;
    }
    let { club }: Props = $props();

    const leagueId = Number($page.url.searchParams.get('leagueId')) || 1;
  
    onMount(async () => {
      const playersList = await playerStore.getPlayers(leagueId);
      if(!playersList){ return }
      players = playersList.players.filter((x) => x.clubId == club.id)
    });
  
    let players: Player[] = $state([]);
    let selectedPosition = writable(-1);
    let sortField: string | null = $state('shirtNumber');
    let sortDirection: 'asc' | 'desc' = $state('asc');

    $effect(() => {
      if ($selectedPosition !== -1) {
        players = players.filter(
          (p) => convertPositionToIndex(p.position) === $selectedPosition
        );
        players = [...players].sort((a, b) => {
          if (!sortField) return 0;
          
          const modifier = sortDirection === 'asc' ? 1 : -1;
          
          switch (sortField) {
              case 'shirtNumber':
                  return (a.shirtNumber - b.shirtNumber) * modifier;
              case 'lastName':
                  return a.lastName.localeCompare(b.lastName) * modifier;
              case 'dateOfBirth':
                  return (Number(a.dateOfBirth) - Number(b.dateOfBirth)) * modifier;
              case 'valueQuarterMillions':
                  return (a.valueQuarterMillions - b.valueQuarterMillions) * modifier;
              default:
                  return 0;
          }
        })
      }
    });
    
    function handleSort(field: string) {
        if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDirection = 'asc';
        }
    }

</script>
  
<div class="stacked-column">
    <PositionFilter {selectedPosition} />
    <PlayersTableHeader sortField={sortField!} {sortDirection} onSort={handleSort} />
    
    {#each players as player}
        <div class="flex items-center p-2 px-4 text-white border-b border-gray-700 xs:py-3 md:py-4">
          <div class="flex items-center justify-start flex">
            <div class="flex items-center w-2/12">
              {player.shirtNumber === 0 ? "-" : player.shirtNumber}
            </div>
            <div class="flex items-center w-2/12">
              {getPositionAbbreviation(convertPositionToIndex(player.position))}
            </div>
            <div class="flex flex-row items-center w-6/12 space-x-8 sm:w-4/12 lg:w-3/12 xl:w-3/12">
              {player.firstName}
              {player.lastName}
            </div>
            <div class="items-center hidden w-1/12 xl:flex">
              {calculateAgeFromNanoseconds(Number(player.dateOfBirth))}
            </div>
            <div class="items-center hidden w-2/12 sm:flex">
              £{(player.valueQuarterMillions / 4).toFixed(2)}m
            </div>
            <div class="flex justify-center w-2/12 xl:justify-start xl:w-1/12">
                <flag class="hidden w-4 h-4 xs:flex"></flag>
            </div>
          </div>
        </div>
    {/each}
</div>
  