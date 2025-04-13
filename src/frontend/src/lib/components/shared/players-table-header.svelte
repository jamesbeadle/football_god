<script lang="ts">
    import SortIcon from "$lib/icons/SortIcon.svelte";
    
    export let sortField: string | null = null;
    export let sortDirection: 'asc' | 'desc' | null = null;
    export let onSort: (field: string) => void;

    function handleSort(field: string) {
        onSort(field);
    }
</script>

<div class="flex p-2 px-4 border-b border-gray-700 bg-BrandLightGray xs:py-3 md:py-4">
    <div class="flex items-center w-2/12 space-x-4 sm:hidden">
        No.
        <button class="cursor-pointer" on:click={() => handleSort('shirtNumber')}>
            <SortIcon 
                className="w-2 lg:w-3 ml-1 xxs:ml-2" 
                fill1={sortField === 'shirtNumber' && sortDirection === 'desc' ? '#000' : '#fff'}
                fill2={sortField === 'shirtNumber' && sortDirection === 'asc' ? '#000' : '#fff'}
            />
        </button>
    </div>
    <div class="items-center hidden w-2/12 space-x-4 sm:flex">
        Number
        <button class="cursor-pointer" on:click={() => handleSort('shirtNumber')}>
            <SortIcon 
                className="w-2 lg:w-3 ml-1 xxs:ml-4" 
                fill1={sortField === 'shirtNumber' && sortDirection === 'desc' ? '#000' : '#fff'}
                fill2={sortField === 'shirtNumber' && sortDirection === 'asc' ? '#000' : '#fff'}
            />
        </button>
    </div>
    <div class="flex w-2/12">Position</div>
    <div class="flex items-center w-6/12 space-x-8 sm:w-4/12 lg:w-3/12 xl:w-3/12">
        Player Name 
        <button class="cursor-pointer" on:click={() => handleSort('lastName')}>
            <SortIcon 
                className="w-2 lg:w-3 ml-1 xxs:ml-4" 
                fill1={sortField === 'lastName' && sortDirection === 'desc' ? '#000' : '#fff'}
                fill2={sortField === 'lastName' && sortDirection === 'asc' ? '#000' : '#fff'}
            />
        </button>
    </div>
    <div class="items-center hidden w-1/12 xl:flex">
        Age 
        <button class="cursor-pointer" on:click={() => handleSort('dateOfBirth')}>
            <SortIcon 
                className="w-2 lg:w-3 ml-1 xxs:ml-4" 
                fill1={sortField === 'dateOfBirth' && sortDirection === 'desc' ? '#000' : '#fff'}
                fill2={sortField === 'dateOfBirth' && sortDirection === 'asc' ? '#000' : '#fff'}
            />
        </button>
    </div>
    <div class="items-center hidden w-2/12 space-x-8 sm:flex">
        Value 
        <button class="cursor-pointer" on:click={() => handleSort('valueQuarterMillions')}> 
            <SortIcon 
                className="w-2 lg:w-3 ml-1 xxs:ml-4" 
                fill1={sortField === 'valueQuarterMillions' && sortDirection === 'desc' ? '#000' : '#fff'}
                fill2={sortField === 'valueQuarterMillions' && sortDirection === 'asc' ? '#000' : '#fff'}
            />
        </button>
    </div>
    <div class="flex justify-center w-2/12 xl:justify-start xl:w-1/12">Nationality</div>
</div>