<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { authStore, type AuthStoreData } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import "../app.css";
  import { writable } from 'svelte/store';

  import { slide } from 'svelte/transition';
  import { BusyScreen, Spinner, Toasts } from "@dfinity/gix-components";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";
    import HomeIcon from "$lib/icons/HomeIcon.svelte";
    import BettingIcon from "$lib/icons/BettingIcon.svelte";
    import GamesIcon from "$lib/icons/GamesIcon.svelte";
    import StarIcon from "$lib/icons/StarIcon.svelte";
    import RulesIcon from "$lib/icons/RulesIcon.svelte";

  const init = async () => await Promise.all([syncAuthStore()]);

  let isExpanded = writable(false);

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

<div class="flex h-screen">
  <div
    class:slide={$isExpanded}
    class:bg-gray-800={$isExpanded}
    class:text-white={$isExpanded}
    class:flex={$isExpanded}
    class:flex-col={$isExpanded}
    class:items-center={$isExpanded}
    class:justify-between={$isExpanded}
    class:py-4={$isExpanded}
    class:w-16={!$isExpanded}
    class:w-48={$isExpanded}
    transition:slide={{ duration: 300 }}>
    <button on:click={() => $isExpanded = !$isExpanded} class="mb-4">
      <!-- Replace with your expand/collapse icon -->
      <span>{$isExpanded ? '<<' : '>>'}</span>
    </button>
    
    <div class="p-5 text-gray-400">
      <div class="flex flex-row text-xl items-center text-white">
        <LogoIcon className="w-6 mr-2 my-4" /> 
        {#if $isExpanded}<span>FootballGod</span>{/if}
      </div>
      <a href="/" class="block mt-4 text-lg">
        <div class="flex flex-row items-center">
          <HomeIcon className="w-6 mr-2" /> 
          {#if $isExpanded}<span>Home</span>{/if}
        </div>
      </a>
      <a href="/" class="block mt-4 text-lg">
        <div class="flex flex-row items-center">
          <BettingIcon className="w-6 mr-2" /> 
          {#if $isExpanded}<span>Match Betting</span>{/if}
        </div>
      </a>
      <a href="/" class="block mt-4 text-lg">
        <div class="flex flex-row items-center">
          <GamesIcon className="w-6 mr-2" /> 
          {#if $isExpanded}<span>Mini Games</span>{/if}
        </div>
      </a>
      <a href="/euro2024" class="block mt-4 text-lg">
        <div class="flex flex-row items-center">
          <StarIcon className="w-6 mr-2" /> 
          {#if $isExpanded}<span>Euro 2024</span>{/if}
        </div>
      </a>
      <a href="/" class="block mt-4 text-lg">
        <div class="flex flex-row items-center">
          <RulesIcon className="w-6 mr-2" /> 
          {#if $isExpanded}<span>Rules</span>{/if}
        </div>
      </a>
    </div>
    
    <!-- Bottom Section, if needed -->
    <div>
      {#if $isExpanded}<span>User</span>{/if}
    </div>
  </div>
  
  <!-- Main content area -->
  <div class="flex-1">
    <p>Main content goes here. Click icons to navigate.</p>
  </div>
</div>
{/await}

<Toasts />
<BusyScreen />




<style>
  .expanded {
    @apply w-48;
  }
</style>