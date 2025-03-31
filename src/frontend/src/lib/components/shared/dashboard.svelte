<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { page } from "$app/stores";
    import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
    import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/user-store";

    import LandingPage from "../landing/landing-page.svelte";

    import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
    import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
    import PlayersIcon from "$lib/icons/side-nav/players-icon.svelte";
    import LeaguesIcon from "$lib/icons/side-nav/leagues-icon.svelte";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";
    import CollapseIcon from "$lib/icons/side-nav/collapse-icon.svelte";
    import ExpandIcon from "$lib/icons/side-nav/expand-icon.svelte";
    import MenuIcon from "$lib/icons/MenuIcon.svelte";
    import XIcon from "$lib/icons/XIcon.svelte";
    import GithubIcon from "$lib/icons/GithubIcon.svelte";
    
    import Disconnect from "$lib/icons/Disconnect.svelte";
    
    import FullScreenSpinner from "./full-screen-spinner.svelte";
    import ProfileIcon from "$lib/icons/ProfileIcon.svelte";
    import { authSignedInStore } from "$lib/derived/auth.derived";

    interface Props { children: Snippet }
    let { children }: Props = $props();

    let isMenuOpen = false;
    let isMobileMenuOpen = false;
    let isLoading = true;

    const menuItems = [
        { icon: HomeIcon, title: "Home", route: "/" },
        { icon: GovernanceIcon, title: "Governance", route: "/governance" },
        { icon: PlayersIcon, title: "Players", route: "/players" },
        { icon: LeaguesIcon, title: "Leagues", route: "/leagues" },
    ];

    onMount( async () => {
        try{
        } catch {
            console.error('Error loading dashboard')
        } finally {
            isLoading = false;
        }
    });

    async function handleLogin() {
        let params: AuthSignInParams = {
            domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
        };
        await authStore.signIn(params);
    }


    function handleLogout() {
        authStore.signOut();
        goto("/");
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
</script>

{#if isLoading}
    <FullScreenSpinner />
{:else}

    {#if $authSignedInStore}
        <div class="flex h-screen md:p-2">
            <div class={`hidden md:flex bg-BrandGray/90 text-white rounded-lg transition-all ${isMenuOpen ? "w-72" : "w-16"} flex-col fixed top-2 bottom-2 left-2`}>
                <div class="relative flex flex-col items-center py-4">
                    <a href="/" class={`flex items-center ${isMenuOpen ? "w-full justify-start p-4" : "justify-center py-4"} transition-all`}>
                        <LogoIcon className="w-4 md:w-6" />
                        {#if isMenuOpen}
                            <span class="ml-2 text-sm tracking-wide md:text-base">Football God</span>
                        {/if}
                    </a>
                    <button
                        on:click={() => (isMenuOpen = !isMenuOpen)}
                        class={`w-8 h-8 bg-zinc-700 flex items-center justify-center rounded-full hover:bg-zinc-600 transition-all ${
                            isMenuOpen ? "absolute right-4 top-1/2 -translate-y-1/2" : ""
                        }`}
                    >
                        {#if isMenuOpen}
                            <CollapseIcon className="w-6" />
                        {:else}
                            <ExpandIcon className="w-6" />
                        {/if}
                    </button>
                </div>
            
                <ul class="flex-1 mt-2 space-y-1">
                    {#each menuItems as item}
                        <li>
                            <a
                                href={item.route}
                                class={`flex items-center px-4 py-2 space-x-2 hover:bg-zinc-700 rounded ${
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
                                    <span class="text-zinc-400">{item.title}</span>
                                {/if}
                            {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
                <div class="absolute left-0 right-0 bottom-20">
                    <div class={`flex ${isMenuOpen ? 'flex-row pl-4 space-x-4' : 'flex-col items-center space-y-4'}`}>
                        <a href="/profile" class="text-white transition-colors hover:text-zinc-400">
                            <ProfileIcon className="w-5 h-5" />
                        </a>
                        <a href="https://x.com/OpenFPL_DAO" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">
                            <XIcon className="w-5 h-5" />
                        </a>
                        <a href="https://github.com/jamesbeadle/football_god" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">
                            <GithubIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                
                <button
                    class={`absolute bottom-4 left-4 right-4 flex items-center justify-center ${
                        isMenuOpen ? "px-4 py-2 space-x-2" : "p-2"
                    } bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-all`}
                    on:click={handleLogout}
                >
                    <Disconnect className="w-6" />
                    {#if isMenuOpen}
                        <span>Disconnect</span>
                    {/if}
                </button>
            </div>
            <div class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-BrandGray md:hidden">
                <div class="flex items-center">
                    <LogoIcon className="w-8" />
                </div>
                <div class="flex items-center space-x-4">
                    <button 
                        class="p-2 text-white transition-colors rounded-full bg-BrandGray"
                        on:click={toggleMobileMenu}
                    >
                        <MenuIcon className="w-6" />
                    </button>
                </div>
            </div>
            {#if isMobileMenuOpen}
                <div class="fixed inset-0 z-40 flex flex-col bg-BrandGray md:hidden mt-[72px]">
                    <ul class="flex-1 p-4 space-y-4">
                        {#each menuItems as item}
                            <li>
                                <a
                                    href={item.route}
                                    class="flex items-center p-2 space-x-4 text-white transition-colors rounded hover:bg-BrandGray"
                                    on:click={() => isMobileMenuOpen = false}
                                >
                                    <svelte:component 
                                        this={item.icon} 
                                        className="w-6 h-6" 
                                        fill={$page.url.pathname === item.route ? '#FFFFFF' : '#9CA3AF'}
                                    />
                                    <span class={$page.url.pathname === item.route ? 'text-white' : 'text-zinc-400'}>
                                        {item.title}
                                    </span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                    <div class="flex p-4 pl-6 space-x-6 border-t border-zinc-700">
                        <a href="/profile" class="text-white transition-colors hover:text-zinc-400">
                            <ProfileIcon className="w-5 h-5" />
                        </a>
                        <button 
                            class="flex items-center justify-center w-10 h-10 text-white rounded-full bg-BrandGray"
                            on:click={handleLogout}
                        >
                            <Disconnect className="w-6" />
                        </button>
                        <a href="https://x.com/OpenFPL_DAO" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">
                            <XIcon className="w-5 h-5" />
                        </a>
                        <a href="https://github.com/jamesbeadle/football_god" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">
                            <GithubIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            {/if}

            <div class={`w-full mt-16 bg-BrandDark lg:${isMenuOpen ? "px-4" : "px-0"} md:px-6 md:py-4 md:mx-2 md:rounded-lg md:mt-0 ${isMenuOpen ? "md:ml-[288px]" : "md:ml-14"} transition-all`}>
                {@render children()}
            </div>
        </div>
    {:else}
        <LandingPage />
    {/if}
{/if}