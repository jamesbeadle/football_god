<script lang="ts">
    import type { Club, Country, League, Player } from "../../../../../../declarations/backend/backend.did";
    import FormComponent from "$lib/components/shared/form-component.svelte";
    import { onMount } from "svelte";
    import { countryStore } from "$lib/stores/country-store";
    import { leagueStore } from "$lib/stores/league-store";
    import { clubStore } from "$lib/stores/club-store";
    
    interface Props {
      selectedLeagueId: number;
      selectedClubId: number;
      filteredPlayers: Player[];
      clubs: Club[];
      allLeaguePlayers: Record<number, Player[]>;
      fetchPlayersForLeague: (leagueId: number) => Promise<void>;
    }

    let { 
      selectedLeagueId,
      selectedClubId,
      filteredPlayers,
      clubs,
      allLeaguePlayers,
      fetchPlayersForLeague 
    }: Props = $props();

    let isLoading = $state(true);

    /* ----- Data Objects ----- */
    let leagues: League[] = [];
    let countries: Country[] = [];

    /* ----- Data Filters ----- */

    let selectedPositionId: number = $state(0);
    let selectedNationalityId = $state(0);    
    let minValue: number = $state(0);
    let maxValue: number = $state(150);
    let searchSurname = $state("");


    /* ----- Dropdown Display Pairs ----- */

    let leagueOptions = leagues.map(league => ({
      id: league.id,
      label: league.name
    }));

    let clubOptions = $derived(clubs.map(club => ({
      id: club.id,
      label: club.friendlyName
    })));

    /* // TODO - Refactor to utilities */

    let positions = [
        { id: 1, positionName: "Goalkeeper"},
        { id: 2, positionName: "Defender"},
        { id: 3, positionName: "Midfielder"},
        { id: 4, positionName: "Forward"}
    ];

  
    let positionOptions = positions.map(pos => ({
      id: pos.id,
      label: pos.positionName
    }));
  
    let nationalityOptions = countries.map(country => ({
      id: country.id,
      label: country.name
    }));

    onMount(async () => {
    try {
        const [countriesResult, leaguesResult, clubsResult] = await Promise.all([
          countryStore.getCountries(),
          leagueStore.getLeagues(),
          clubStore.getClubs(selectedLeagueId),
        ]);

        if (!countriesResult) throw new Error('Failed to fetch countries');
        if (!leaguesResult) throw new Error('Failed to fetch leagues');
        if (!clubsResult) throw new Error('Failed to fetch clubs');

        countries = countriesResult.countries;
        leagues = leaguesResult.leagues;
        clubs = clubsResult.clubs;

        await fetchPlayersForLeague(selectedLeagueId);
        filteredPlayers = allLeaguePlayers[selectedLeagueId] || [];
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        isLoading = false;
      }
    });


    
    $effect(() => {
      const leaguePlayers = allLeaguePlayers[selectedLeagueId] || [];
      const minValueNum = Number(minValue) || 0;
      const maxValueNum = Number(maxValue) || 150;
      const searchTerm = searchSurname?.toLowerCase() || "";
      const filterPosition =
        selectedPositionId === 1 ? "Goalkeeper" :
        selectedPositionId === 2 ? "Defender" :
        selectedPositionId === 3 ? "Midfielder" :
        selectedPositionId === 4 ? "Forward" : null;

      filteredPlayers =  leaguePlayers.filter(
        (player) =>
          (!filterPosition || Object.keys(player.position).includes(filterPosition)) &&
          (selectedClubId === 0 || player.clubId === selectedClubId) &&
          (selectedNationalityId === 0 || player.nationality === selectedNationalityId) &&
          player.valueQuarterMillions / 4 >= minValueNum &&
          player.valueQuarterMillions / 4 <= maxValueNum &&
          (searchTerm === "" || player.lastName.toLowerCase().includes(searchTerm))
      );
    });

    $effect(() => {
      if (selectedLeagueId && selectedLeagueId > 0) {
        isLoading = true;
        fetchPlayersForLeague(selectedLeagueId);
        filterClubs();
      }
    });

    async function filterClubs() {
      let clubsResult = await clubStore.getClubs(selectedLeagueId);
        if(!clubsResult) throw new Error("Error loading clubs")
        clubs = [...clubsResult.clubs];
    }

    function handleLeagueChange(value: string | number) {
        selectedLeagueId = Number(value);
    }

    function handleClubChange(value: string | number) {
        selectedClubId = Number(value);
    }

    function handlePositionChange(value: string | number) {
        selectedPositionId = Number(value);
    }

    function handleNationalityChange(value: string | number) {
        selectedNationalityId = Number(value);
    }

    function onValueChange() {

    }
  
    function onSearch() {

    }

    function onKeyPress(){
      
    }

</script>
  
<div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
            <FormComponent label="Select League">
                <select class="brand-dropdown" bind:value={selectedLeagueId}>
                  {#each leagueOptions as league}
                    <option value={league.id}>{league.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
        <div class="w-full">
            <FormComponent label="Select Club">
                <select class="brand-dropdown" bind:value={selectedClubId}>
                    {#each clubOptions as club}
                    <option value={club.id}>{club.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
    </div>
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
            <FormComponent label="Select Position">
                <select class="brand-dropdown" bind:value={selectedPositionId}>
                  {#each positionOptions as position}
                    <option value={position.id}>{position.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
        <div class="w-full">
            <FormComponent label="Select Position">
                <select class="brand-dropdown" bind:value={selectedNationalityId}>
                  {#each nationalityOptions as country}
                    <option value={country.id}>{country.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full px-3 md:px-0">
            <label for="minValue" class="block mb-1 text-xs text-white">Min Value (M):</label>
            <div class="relative">
                <input
                    type="number"
                    id="minValue"
                    bind:value={minValue}
                    step="0.25"
                    class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
                    placeholder="0"
                    oninput={onValueChange}
                />
            </div>
        </div>
        <div class="w-full px-3 md:px-0">
            <label for="maxValue" class="block mb-1 text-xs text-white">Max Value (M):</label>
            <div class="relative">
                <input
                    type="number"
                    id="maxValue"
                    bind:value={maxValue}
                    step="0.25"
                    class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
                    placeholder="150"
                    oninput={onValueChange}
                />
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
        <div class="w-full">
            <label for="searchSurname" class="block px-3 mb-1 text-xs text-white md:px-0">Search by Surname:</label>
            <div class="flex px-3 space-x-2 md:px-0">
                <div class="relative flex-1">
                    <input
                        type="text"
                        id="searchSurname"
                        bind:value={searchSurname}
                        class="w-full p-3 text-white transition-colors rounded-lg bg-BrandGray hover:bg-BrandGray/50 focus:outline-none focus:ring-0 focus:border-BrandPurple/60"
                        placeholder="Enter surname"
                        oninput={onSearch}
                        onkeypress={onKeyPress}
                    />
                </div>
                <button
                    class="px-4 py-2 text-sm text-white transition-colors rounded-lg bg-BrandPurple hover:bg-BrandPurple/80 focus:outline-none focus:ring-2 focus:ring-BrandPurple"
                    onclick={onSearch}
                >
                    Search
                </button>
            </div>
        </div>
    </div>
</div>