<script lang="ts">
    import { type Snippet } from "svelte";
    import { authSignedInStore } from "$lib/derived/auth.derived";
    import { busy } from "$lib/stores/busy-store";
    import LoggedInHeader from "./logged-in-header.svelte";
    import Sidebar from "./sidebar.svelte";
    import LandingPage from "../landing/landing-page.svelte";
    import FullScreenSpinner from "./full-screen-spinner.svelte";
    
    interface Props { children: Snippet }
    
    let { children }: Props = $props();
    let isMenuOpen = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
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
