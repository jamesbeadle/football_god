<script lang="ts">
  import { onMount } from "svelte"; 
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";

  import { browser } from "$app/environment";

  import { userStore } from "$lib/stores/user-store";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { authStore, type AuthSignInParams, type AuthStoreData } from "$lib/stores/auth-store";
  
  import Dashboard from "$lib/components/shared/dashboard.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  
  import "../app.css";
  

  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;

  let isAdmin = false;
  
  const init = async () => await Promise.all([syncAuthStore()]);

  const syncAuthStore = async () => {
    if (!browser) {
      return;
    }

    try {
      await authStore.sync();
    } catch (err: unknown) {
    }
  };

  onMount(async () => {
    worker = await initAuthWorker();
    isAdmin = await userStore.isAdmin();
  });

  $: worker, $authStore, (() => worker?.syncAuthIdle($authStore))();

  $: (() => {
    if (!browser) {
      return;
    }

    if ($authStore === undefined) {
      return;
    }

    const spinner = document.querySelector("body > #app-spinner");
    spinner?.remove();
  })();

  function handleLogin() {
    let params: AuthSignInParams = {
      domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
    };
    authStore.signIn(params);
  }

</script>

<svelte:window on:storage={syncAuthStore} />
{#await init()}
  <div in:fade>
    <FullScreenSpinner />
  </div>
{:then _}
  <Dashboard>
    <slot></slot>
  </Dashboard>
{/await}