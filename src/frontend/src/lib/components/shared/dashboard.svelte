<script lang="ts">
    import { onMount } from "svelte";
    import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
    import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
    import PlayersIcon from "$lib/icons/side-nav/players-icon.svelte";
    import LeaguesIcon from "$lib/icons/side-nav/leagues-icon.svelte";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";
    import CollapseIcon from "$lib/icons/side-nav/collapse-icon.svelte";
    import ExpandIcon from "$lib/icons/side-nav/expand-icon.svelte";
    import { page } from "$app/stores";
    import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
    import Connect from "$lib/icons/Connect.svelte";
    import Disconnect from "$lib/icons/Disconnect.svelte";
    import { goto } from "$app/navigation";

    let isMenuOpen = false;
    let isLoggedIn: Boolean;

    const menuItems = [
        { icon: HomeIcon, title: "Home", route: "/" },
        { icon: GovernanceIcon, title: "Governance", route: "/governance" },
        { icon: PlayersIcon, title: "Players", route: "/players" },
        { icon: LeaguesIcon, title: "Leagues", route: "/leagues" },
    ];

    onMount( async () => {

      authStore.subscribe((store) => {
        isLoggedIn = store.identity !== null && store.identity !== undefined;
      });

    });

    function handleLogin() {
        let params: AuthSignInParams = {
            domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
        };
        authStore.signIn(params);
    }

    function handleLogout() {
        authStore.signOut();
        goto("/");
    }
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
        
        {#if isLoggedIn}
        <button
            class={`absolute bottom-4 left-4 right-4 flex items-center justify-center ${
                isMenuOpen ? "px-4 py-2 space-x-2" : "p-2"
            } bg-BrandAltGray hover:bg-BrandDarkGray text-white rounded transition-all`}
            on:click={handleLogout}
        >
            <Disconnect className="w-6" />
            {#if isMenuOpen}
                <span>Disconnect</span>
            {/if}
        </button>
    {:else}
        <button
            class={`absolute bottom-4 left-4 right-4 flex items-center justify-center ${
                isMenuOpen ? "px-4 py-2 space-x-2" : "p-2"
            } bg-BrandPurple hover:bg-BrandDarkGray text-white rounded transition-all`}
            on:click={handleLogin}
        >
            <Connect className="w-6" />
            {#if isMenuOpen}
                <span>Connect</span>
            {/if}
        </button>
    {/if}

    </div>
    <div class="mx-2 rounded-lg px-6 py-4 w-full bg-BrandGray">
        <slot></slot>
    </div>
    
</div>
