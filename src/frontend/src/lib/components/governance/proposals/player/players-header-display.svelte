<script lang="ts">
    import DropdownSelect from "$lib/components/shared/dropdown-select.svelte";
  
    export let leagues: { id: number; label: string }[] = [];
    export let clubs: { id: number; label: string }[] = [];
    export let positions: { id: number; label: string }[] = [];
    export let nationalities: { id: number; label: string }[] = [];
  
    export let selectedLeagueId: number = 0;
    export let selectedClubId: number = 0;
    export let selectedPositionId: number = 0;
    export let selectedNationalityId: number = 0;
    export let minValue: number = 0;
    export let maxValue: number = 150;
    export let searchSurname: string = "";
  
    export let onLeagueChange: (value: string | number) => void;
    export let onClubChange: (value: string | number) => void;
    export let onPositionChange: (value: string | number) => void;
    export let onNationalityChange: (value: string | number) => void;
    export let onValueChange: () => void;
    export let onSearch: () => void;
    export let onKeyPress: (event: KeyboardEvent) => void;
</script>
  
<div class="space-y-4">
    <!-- League and Club Pair -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
            <DropdownSelect
                value={selectedLeagueId}
                options={leagues}
                onChange={onLeagueChange}
                placeholder="Select League"
                allOptionText="Leagues"
                compact={true}
            />
        </div>
        <div class="w-full">
            <DropdownSelect
                value={selectedClubId}
                options={clubs}
                onChange={onClubChange}
                placeholder="Select Club"
                allOptionText="Clubs"
                compact={true}
            />
        </div>
    </div>
  
    <!-- Position and Nationality Pair -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
            <DropdownSelect
                value={selectedPositionId}
                options={positions}
                onChange={onPositionChange}
                placeholder="Select Position"
                allOptionText="Positions"
                compact={true}
            />
        </div>
        <div class="w-full">
            <DropdownSelect
                value={selectedNationalityId}
                options={nationalities}
                onChange={onNationalityChange}
                placeholder="Select Nationality"
                allOptionText="Nationalities"
                compact={true}
            />
        </div>
    </div>

    <!-- Min Value and Max Value Pair -->
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
                    on:input={onValueChange}
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
                    on:input={onValueChange}
                />
            </div>
        </div>
    </div>

    <!-- Search Surname (Full Width) -->
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
                        on:input={onSearch}
                        on:keypress={onKeyPress}
                    />
                </div>
                <button
                    class="px-4 py-2 text-sm text-white transition-colors rounded-lg bg-BrandPurple hover:bg-BrandPurple/80 focus:outline-none focus:ring-2 focus:ring-BrandPurple"
                    on:click={onSearch}
                >
                    Search
                </button>
            </div>
        </div>
    </div>
</div>