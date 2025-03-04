<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import ArrowUp from "$lib/icons/ArrowUp.svelte";
    import ArrowDown from "$lib/icons/ArrowDown.svelte";
    import Checkmark from "$lib/icons/Checkmark.svelte";
    import { activeDropdownId } from "$lib/stores/dropdown-store";


    export let value: string | number;
    export let options: { id: string | number; label: string }[];
    export let placeholder = "Select...";
    export let compact = false;
    export let onChange: (value: string | number) => void;
    export let allOptionText: string | undefined = undefined;
    export let scrollOnOpen = false;

    const dropdownId = Math.random().toString(36).substring(7);
    let isDropdownOpen = false;
    let dropdownElement: HTMLDivElement;

    activeDropdownId.subscribe((id) => {
        if (id !== dropdownId) {
            isDropdownOpen = false;
        }
    });

    $: allOptions = allOptionText 
        ? [{ id: 0, label: `All ${allOptionText}` }, ...options]
        : options;
    $: selectedOption = allOptions.find(opt => opt.id === value);

    function toggleDropdown(e: MouseEvent) {
        e.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
        if (isDropdownOpen) {
            activeDropdownId.set(dropdownId);
        } else {
            activeDropdownId.set(null);
        }
        if (scrollOnOpen && isDropdownOpen) {
            setTimeout(() => {
                dropdownElement?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 50);
        }
    }

    function selectOption(optionId: string | number, e: MouseEvent) {
        e.stopPropagation();
        onChange(optionId);
        isDropdownOpen = false;
    }

    function handleClickOutside(event: MouseEvent) {
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
            isDropdownOpen = false;
        }
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            document.addEventListener('click', handleClickOutside);
        }
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            document.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<div class="relative w-full px-3 mt-1 md:px-0" bind:this={dropdownElement}>
    <button
        class="flex items-center justify-between w-full rounded-lg {compact ? 'p-3 bg-BrandGray  hover:bg-BrandGray/50' : 'px-2 py-3 hover:bg-BrandGray'}"
        on:click={e => toggleDropdown(e)}
    >
        <span class="text-white">{selectedOption?.label ?? placeholder}</span>
        <span class="w-4 h-4">
            {#if isDropdownOpen}
                <ArrowUp fill="white" />
            {:else}
                <ArrowDown fill="white" />
            {/if}
        </span>
    </button>
    
    {#if isDropdownOpen}
        <ul class="absolute z-50 py-1 mt-1 rounded-lg shadow-lg w-[calc(100%-2rem)] max-h-[200px] overflow-y-auto scrollbar-thin {compact ? 'bg-BrandBlack' : 'bg-BrandGray'}">
            {#each allOptions as option}
                <li class="mb-1">
                    <button 
                        class={`w-full px-4 py-2 text-left rounded-lg flex items-center justify-between ${value === option.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-BrandPurple"}`}
                        on:click={e => selectOption(option.id, e)}
                    >
                        {option.label}
                        {#if value === option.id}
                            <Checkmark className="w-4 h-4" />
                        {/if}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div> 