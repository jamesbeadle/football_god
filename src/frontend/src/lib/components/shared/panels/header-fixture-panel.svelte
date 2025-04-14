<script lang="ts">
    import { page } from '$app/stores';
    import type { Club} from "../../../../../../declarations/backend/backend.did";
    import BadgeIcon from "$lib/icons/BadgeIcon.svelte";

    interface Props {
        header: string;
        nextFixtureHomeTeam: Club | undefined;
        nextFixtureAwayTeam: Club | undefined;
    }
    let { header, nextFixtureHomeTeam, nextFixtureAwayTeam }: Props = $props();


    let leagueId = Number($page.url.searchParams.get('leagueId')) || 1; 
</script>

<div class="stacked-column items-center">
    <p class="content-panel-header">{header}</p>
    
    <div class="flex justify-center w-full space-x-8">
        <a
          class="stacked-column items-center justify-center"
          href={`/club?id=${nextFixtureHomeTeam ? nextFixtureHomeTeam.id : -1}&leagueId=${leagueId}`}
        >
          <BadgeIcon className="header-badge" primaryColour={nextFixtureHomeTeam?.primaryColourHex ?? ""} secondaryColour={nextFixtureHomeTeam?.secondaryColourHex ?? ""} thirdColour={nextFixtureHomeTeam?.thirdColourHex ?? ""} />
          <span class="text-center content-panel-header">
            {nextFixtureHomeTeam ? nextFixtureHomeTeam.abbreviatedName : ""}
          </span>
        </a>
        
        <div class="flex items-center justify-center">
          <span class="content-panel-header">VS</span>
        </div>
        
        <a
          class="stacked-column items-center justify-center"
          href={`/club?id=${nextFixtureAwayTeam ? nextFixtureAwayTeam.id : -1}&leagueId=${leagueId}`}
        >
          <BadgeIcon className="header-badge" primaryColour={nextFixtureAwayTeam?.primaryColourHex ?? ""} secondaryColour={nextFixtureAwayTeam?.secondaryColourHex ?? ""} thirdColour={nextFixtureAwayTeam?.thirdColourHex ?? ""} />
          <span class="text-center content-panel-header">
            {nextFixtureAwayTeam ? nextFixtureAwayTeam.abbreviatedName : ""}
          </span>
        </a>
    </div>
</div>