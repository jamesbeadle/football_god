<script lang="ts">
  import { onMount } from "svelte"; 
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  import { userStore } from "$lib/stores/user-store";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth-store";

  import Dashboard from "$lib/components/shared/dashboard.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";

  import "../app.css";

  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;
  let isAdmin = false;

  async function syncAuthStore() {
    if (!browser) return;
    try {
      await authStore.sync();
    } catch (err: unknown) {
      console.error(err);
    }
  }

  const init = async () => {
    await Promise.all([syncAuthStore()]);
  };

  onMount(async () => {
    worker = await initAuthWorker();
    await userStore.sync();
    isAdmin = await userStore.isAdmin();
  });

  $: worker, $authStore, (() => worker?.syncAuthIdle($authStore))();

  $: (() => {
    if (!browser || $authStore === undefined) return;
    const spinner = document.querySelector("body > #app-spinner");
    spinner?.remove();
  })();
</script>

<svelte:window on:storage={syncAuthStore} />

{#await init()}
  <div in:fade>
    <FullScreenSpinner />
  </div>
{:then _}
  <Dashboard>
    <slot />
  </Dashboard>
{/await}
