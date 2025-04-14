<script lang="ts">
    import FormComponent from "$lib/components/shared/form-component.svelte";

    interface Props {
        visible: boolean;
        closeModal: () => void;
        leagues: { id: number; label: string }[];
        clubs: { id: number; label: string }[];
        positions: { id: number; label: string }[];
        nationalities: { id: number; label: string }[];
        selectedLeagueId: number;
        selectedClubId: number;
        selectedPositionId: number;
        selectedNationalityId: number;
        minValue: number;
        maxValue: number;
        searchSurname: string;
        onLeagueChange: (value: string | number) => void;
        onClubChange: (value: string | number) => void;
        onPositionChange: (value: string | number) => void;
        onNationalityChange: (value: string | number) => void;
        onValueChange: () => void;
        onSearch: () => void;
        onKeyPress: (event: KeyboardEvent) => void
    }

    let { visible, closeModal, leagues, clubs, positions, nationalities, selectedLeagueId, 
            selectedClubId, selectedPositionId, selectedNationalityId, minValue, maxValue, searchSurname, 
            onLeagueChange, onClubChange, onPositionChange, onNationalityChange, onValueChange, onSearch, onKeyPress }: Props = $props();
</script>
  
<div class="space-y-4">
    <!-- League and Club Pair -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
            <FormComponent label="Select League">
                <select class="brand-dropdown" bind:value={selectedLeagueId}>
                  {#each leagues as league}
                    <option value={league.id}>{league.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
        <div class="w-full">
            <FormComponent label="Select League">
                <select class="brand-dropdown" bind:value={selectedClubId}>
                    {#each clubs as club}
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
                  {#each positions as position}
                    <option value={position.id}>{position.label}</option>
                  {/each}
                </select>
            </FormComponent>
        </div>
        <div class="w-full">
            <FormComponent label="Select Position">
                <select class="brand-dropdown" bind:value={selectedNationalityId}>
                  {#each nationalities as country}
                    <option value={country.id}>{country.label}</option>
                  {/each}
                </select>
            </FormComponent>
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