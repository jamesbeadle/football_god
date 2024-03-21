<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { authStore, type AuthStoreData } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import Header from "$lib/shared/Header.svelte";
  import Footer from "$lib/shared/Footer.svelte";
  import "../app.css";

  import { BusyScreen, Spinner, Toasts } from "@dfinity/gix-components";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";

  const init = async () => await Promise.all([syncAuthStore()]);

  let isMobile = false;
  let sidebarOpen = false;
  
  onMount(() => {
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
      if (!isMobile) {
        sidebarOpen = false;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  function toggleSidebar() {
    if (isMobile) {
      sidebarOpen = !sidebarOpen;
    }
  }

  const syncAuthStore = async () => {
    if (!browser) {
      return;
    }

    try {
      await authStore.sync();
    } catch (err: unknown) {
      toastsError({
        msg: {
          text: "Unexpected issue while syncing the status of your authentication.",
        },
        err,
      });
    }
  };

  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;

  onMount(async () => (worker = await initAuthWorker()));

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
</script>

<svelte:window on:storage={syncAuthStore} />
{#await init()}
  <div in:fade>
    <Spinner />
  </div>
{:then _}
  <div class="flex h-screen overflow-hidden">
    {#if isMobile}
      <button
        class="p-4 text-xl leading-none text-white bg-transparent border border-transparent rounded focus:outline-none lg:hidden"
        on:click={toggleSidebar}>
        <!-- Ensure you have the icon library loaded -->
        <i class="fas fa-bars"></i>
      </button>
    {/if}

    <aside
      class={`fixed top-0 left-0 w-64 bg-GRAY text-white h-full overflow-auto transition-transform duration-300 ease-in-out z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div class="p-5">
        <div class="flex flex-row text-xl items-center">
          <LogoIcon className="w-6 mr-2 my-4" /> FootballGod
        </div>
        <a href="/" class="block mt-4 text-lg">Home</a>
        <a href="/" class="block mt-4 text-lg">Match Betting</a>
        <a href="/" class="block mt-4 text-lg">Mini Games</a>
        <a href="/" class="block mt-4 text-lg">Euro 2024</a>
        <a href="/" class="block mt-4 text-lg">Rules</a>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-col w-full">

      <!-- Profile Icon (visible only on desktop) -->
      <div class="absolute top-0 right-0 p-4 hidden lg:block">
        <button class="focus:outline-none">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
        </button>
      </div>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
{/await}

<Toasts />
<BusyScreen />

<style>
  main {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
</style>
