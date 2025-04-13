<script lang="ts">
  import { getImageURL } from "$lib/utils/helpers";
    import type { Country, League, LeagueStatus } from "../../../../../declarations/backend/backend.did";

  export let league: League;
  export let leagueStatus: LeagueStatus | null;
  export let countries: Country[];

  function getSeason(seasonID: number) {
    if(seasonID == 1) return "2024/2025";
    if(seasonID == 0) return "2023/2024";
    return "Unknown";
  }
</script>

<div class="stacked-col p-4 mb-4 space-y-4">
  <div class="flex items-center space-x-4">
    <img src={getImageURL(league.logo)} alt="logo" class="w-8 h-8" />
    <h1 class="text-xl">{league.name}</h1>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label for="abbreviated-name" class="block text-xs">Abbreviated Name</label>
      <p>{league.abbreviation}</p>
    </div>
    <div>
      <label for="governing-body" class="block text-xs">Governing Body</label>
      <p>{league.governingBody}</p>
    </div>
    <div>
      <label for="related-gender" class="block text-xs">Gender</label>
      <p>{Object.keys(league.relatedGender)[0]}</p>
    </div>
    <div>
      <label for="country" class="block text-xs">Country</label>
      <p>{countries.find(x => x.id == league?.countryId)?.name}</p>
    </div>
    {#if leagueStatus}
      <div>
        <label for="active-season" class="block text-xs">Active Season</label>
        <p>{getSeason(leagueStatus.activeSeasonId)}</p>
      </div>
      <div>
        <label for="active-gameweek" class="block text-xs">Active Gameweek</label>
        <p>{leagueStatus.unplayedGameweek}</p>
      </div>
      <div>
        <label for="transfer-window-active" class="block text-xs">Transfer Window Active</label>
        <p>{leagueStatus.transferWindowActive ? "Yes" : "No"}</p>
      </div>
      <div>
        <label for="season-active" class="block text-xs">Season Active</label>
        <p>{leagueStatus.seasonActive ? "Yes" : "No"}</p>
      </div>
    {/if}
  </div>
</div>
