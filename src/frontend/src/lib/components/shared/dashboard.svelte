<script lang="ts">
    import { type Snippet } from "svelte";

    import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
    import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
    import PlayersIcon from "$lib/icons/side-nav/players-icon.svelte";
    import LeaguesIcon from "$lib/icons/side-nav/leagues-icon.svelte";
    import { authSignedInStore } from "$lib/derived/auth.derived";
    import FullScreenSpinner from "./full-screen-spinner.svelte";
    import { busy } from "$lib/stores/busy-store";
    import LoggedInHeader from "./logged-in-header.svelte";
    import Sidebar from "./sidebar.svelte";
    import LandingPage from "../landing/landing-page.svelte";

    interface Props { children: Snippet }
    let { children }: Props = $props();

    let isMenuOpen = $state(false);


    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    const menuItems = [
        { icon: HomeIcon, title: "Home", route: "/" },
        { icon: GovernanceIcon, title: "Governance", route: "/governance" },
        { icon: PlayersIcon, title: "Players", route: "/players" },
        { icon: LeaguesIcon, title: "Leagues", route: "/leagues" },
    ];
</script>

{#if $busy}
    <FullScreenSpinner message="Checking for Existing Profile" />
{:else}
    {#if $authSignedInStore}
        <div class="relative flex flex-col w-full min-h-screen">
            <LoggedInHeader {toggleMenu} />
            <main class="flex-1 w-full mt-16 overflow-x-hidden">
                {@render children()}
            </main>
        </div>
        <Sidebar {isMenuOpen} {toggleMenu} isSaleOnly={false} />
        {#if isMenuOpen}
            <button 
            class="fixed inset-0 z-30 pointer-events-none bg-black/40 sm:bg-black/20 sm:pointer-events-auto"
            onclick={toggleMenu}
            onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
            aria-label="Close menu overlay"
            ></button>
        {/if}
    {:else}
        <LandingPage />
    {/if}
{/if}
