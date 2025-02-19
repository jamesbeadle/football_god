<script lang="ts">
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
    import type { ClubDTO} from "../../../../../../declarations/data_canister/data_canister.did";
    import { page } from '$app/stores';
    export let header: string;
    export let nextFixtureHomeTeam: ClubDTO | undefined;
    export let nextFixtureAwayTeam: ClubDTO | undefined;

    let leagueId = Number($page.url.searchParams.get('leagueId')) || 1; 
</script>

<div class="flex flex-col items-center flex-grow">
    <p class="content-panel-header">{header}</p>
    
    <div class="flex justify-center w-full space-x-8">
        <a
          class="flex flex-col items-center justify-center"
          href={`/club?id=${nextFixtureHomeTeam ? nextFixtureHomeTeam.id : -1}&leagueId=${leagueId}`}
        >
          <BadgeIcon className="header-badge" primaryColour={nextFixtureHomeTeam?.primaryColourHex} secondaryColour={nextFixtureHomeTeam?.secondaryColourHex} thirdColour={nextFixtureHomeTeam?.thirdColourHex} />
          <span class="text-center content-panel-header">
            {nextFixtureHomeTeam ? nextFixtureHomeTeam.abbreviatedName : ""}
          </span>
        </a>
        
        <div class="flex items-center justify-center">
          <span class="content-panel-header">VS</span>
        </div>
        
        <a
          class="flex flex-col items-center justify-center"
          href={`/club?id=${nextFixtureAwayTeam ? nextFixtureAwayTeam.id : -1}&leagueId=${leagueId}`}
        >
          <BadgeIcon className="header-badge" primaryColour={nextFixtureAwayTeam?.primaryColourHex} secondaryColour={nextFixtureAwayTeam?.secondaryColourHex} thirdColour={nextFixtureAwayTeam?.thirdColourHex} />
          <span class="text-center content-panel-header">
            {nextFixtureAwayTeam ? nextFixtureAwayTeam.abbreviatedName : ""}
          </span>
        </a>
    </div>
</div>