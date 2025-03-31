<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  import { get } from "svelte/store";
  import { appStore } from "$lib/stores/app-store";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth-store";

  import { displayAndCleanLogoutMsg } from "$lib/services/auth.services";
  import Dashboard from "$lib/components/shared/dashboard.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import { toasts } from "$lib/stores/toasts-store";
  import Toasts from "$lib/components/toasts/toasts.svelte";

  import "../app.css";

  interface Props { children: Snippet }
  let { children }: Props = $props();
    
  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;
  let isLoading = $state(true);

  const init = async () => {
    if (!browser) return;
    await authStore.sync();
    displayAndCleanLogoutMsg();
  };

  onMount(async () => {
    console.log("on mount")
    console.log(browser)
    if (browser) {
      document.querySelector('#app-spinner')?.remove();
    }
    console.log("init")
    await init();
    console.log("complete")
    const identity = get(authStore).identity;
    console.log(identity)
    if (identity) {
      try {
      } catch (err) {
        console.error('initUserProfile error:', err);
      }
    }
    console.log("init auth worker")
    worker = await initAuthWorker();
    console.log("init auth worker complete")
    isLoading = false;
  });
</script>

<svelte:window on:storage={authStore.sync} />

{#if browser && isLoading}
  <div in:fade>
    <FullScreenSpinner />
  </div>
{:else}
  <Dashboard>
    {@render children()}
  </Dashboard>
  <Toasts />
{/if}