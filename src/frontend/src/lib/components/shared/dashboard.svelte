<script>
    import { onMount } from "svelte";
    import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
    import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
    import PlayersIcon from "$lib/icons/side-nav/players-icon.svelte";
    import LeaguesIcon from "$lib/icons/side-nav/leagues-icon.svelte";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";
    import CollapseIcon from "$lib/icons/side-nav/collapse-icon.svelte";
    import ExpandIcon from "$lib/icons/side-nav/expand-icon.svelte";
    import { page } from "$app/stores";

    let isMenuOpen = false;

    const menuItems = [
        { icon: HomeIcon, title: "Home", route: "/" },
        { icon: GovernanceIcon, title: "Governance", route: "/governance" },
        { icon: PlayersIcon, title: "Players", route: "/players" },
        { icon: LeaguesIcon, title: "Leagues", route: "/leagues" },
    ];

    onMount(() => {});
</script>

<div class="flex h-screen p-2">
    <div class={`bg-BrandGray text-white rounded-lg transition-all ${isMenuOpen ? "w-72" : "w-16"} flex flex-col relative`}>
        <div class="relative flex flex-col items-center">
            <a href="/" class={`flex items-center ${isMenuOpen ? "w-full justify-start p-4" : "justify-center py-4"} transition-all`}>
                <LogoIcon className="w-4 md:w-6" />
                {#if isMenuOpen}
                    <span class="ml-2 tracking-wide text-sm md:text-base">FootballGod</span>
                {/if}
            </a>
            <button
                on:click={() => (isMenuOpen = !isMenuOpen)}
                class={`w-8 h-8 bg-BrandAltGray flex items-center justify-center rounded-full hover:bg-BrandDarkGray transition-all ${
                    isMenuOpen ? "absolute right-4 top-1/2 transform -translate-y-1/2" : ""
                }`}
            >
                {#if isMenuOpen}
                    <CollapseIcon className="w-6" />
                {:else}
                    <ExpandIcon className="w-6" />
                {/if}
            </button>
        </div>
    
        <ul class="flex-1 space-y-1 mt-2">
            {#each menuItems as item}
                <li>
                    <a
                        href={item.route}
                        class={`flex items-center px-4 py-2 space-x-2 hover:bg-BrandAltGray rounded ${
                            isMenuOpen ? "justify-start" : "justify-center"
                        }`}
                    >
                    {#if $page.url.pathname == item.route}
                        <svelte:component this={item.icon} className="w-5 h-5" fill='#FFFFFF' />
                        {#if isMenuOpen}
                            <span>{item.title}</span>
                        {/if}
                    {:else}
                        <svelte:component this={item.icon} className="w-5 h-5" />
                        {#if isMenuOpen}
                            <span class="text-BrandDisabled">{item.title}</span>
                        {/if}
                    {/if}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="mx-2 rounded-lg px-6 py-4 w-full bg-BrandGray">
        <slot></slot>
    </div>
    
</div>
