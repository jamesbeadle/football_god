<script lang="ts">

  import { onMount, type Snippet } from "svelte";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";

  import { browser } from "$app/environment";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { displayAndCleanLogoutMsg } from "$lib/services/auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth-store";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import LoggedInHeader from "$lib/components/shared/logged-in-header.svelte";
  import Sidebar from "$lib/components/shared/sidebar.svelte";
  import LandingPage from "$lib/components/landing/landing-page.svelte";
  import Toasts from "$lib/components/toasts/toasts.svelte";
  
  import "../app.css";
  import "../style/text.css";
  import "../style/input.css";
  import "../style/container.css";
  import "../style/icons.css";
  import "../style/button.css";
  
  interface Props { children: Snippet }
  let { children }: Props = $props();
    
  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;
  let isLoading = $state(true);
  let isMenuOpen = $state(false);

  onMount(async () => {
    if (browser) {
      document.querySelector('#app-spinner')?.remove();
    }
    await init();
    const identity = get(authStore).identity;
    if (identity) {
      try {
      } catch (err) {
        console.error('Error mounting Football God:', err);
      }
    }
    worker = await initAuthWorker();
    isLoading = false;
  });

  const init = async () => {
    if (!browser) return;
    await authStore.sync();
    displayAndCleanLogoutMsg();
  };

  function toggleMenu() {
      isMenuOpen = !isMenuOpen;
  }

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