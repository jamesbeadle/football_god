<script lang="ts">

  import { onMount, type Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { displayAndCleanLogoutMsg } from "$lib/services/auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth-store";
  import { get } from "svelte/store";
  
  import "../app.css";
  import Toasts from "$lib/components/toasts/toasts.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import LoggedInHeader from "$lib/components/shared/logged-in-header.svelte";
  import Sidebar from "$lib/components/shared/sidebar.svelte";
  import LandingPage from "$lib/components/landing/landing-page.svelte";
  
  interface Props { children: Snippet }
  let { children }: Props = $props();
    
  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;
  let isLoading = $state(true);
  let isMenuOpen = $state(false);

  function toggleMenu() {
      isMenuOpen = !isMenuOpen;
  }

  const init = async () => {
    if (!browser) return;
    await authStore.sync();
    displayAndCleanLogoutMsg();
  };

  onMount(async () => {
    if (browser) {
      document.querySelector('#app-spinner')?.remove();
    }
    await init();
    const identity = get(authStore).identity;
    if (identity) {
      try {
      } catch (err) {
        console.error('initUserProfile error:', err);
      }
    }
    worker = await initAuthWorker();
    isLoading = false;
  });
</script>

<svelte:window on:storage={authStore.sync} />

{#if browser && isLoading}
  <div in:fade>
    <FullScreenSpinner />
  </div>
{:else}
  {#if $authSignedInStore}
    <LoggedInHeader {toggleMenu} />
    <div class="mx-6 mt-6">
        {@render children()}
    </div>
    <Sidebar {isMenuOpen} {toggleMenu} />
    <Toasts />
  {:else}
    <LandingPage />
  {/if}
{/if}