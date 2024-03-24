<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import { writable } from 'svelte/store';
  import { BusyScreen, Spinner, Toasts } from "@dfinity/gix-components";
  import LogoIcon from "$lib/icons/LogoIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import BettingIcon from "$lib/icons/BettingIcon.svelte";
  import GamesIcon from "$lib/icons/GamesIcon.svelte";
  import StarIcon from "$lib/icons/StarIcon.svelte";
  import RulesIcon from "$lib/icons/RulesIcon.svelte";
  import { fade } from "svelte/transition";
  import "../app.css";
  
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
    class="bg-gray-800 text-white flex flex-col justify-between transition-width duration-300 p-5"
    style="width: {$isExpanded ? '16rem' : '4rem'}">
      <div>
        <button on:click={() => $isExpanded = !$isExpanded} class="mb-4">
          <span>{$isExpanded ? '<<' : '>>'}</span>
        </button>
  
        <div class="text-gray-400">
          <!-- The logo will be here, right below the expand button -->
          <div class="flex flex-row text-xl items-center text-white">
            <LogoIcon className="w-6 mr-2 my-4" />
            {#if $isExpanded}
              <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>FootballGod</span>
            {/if}
          </div>
  
          <!-- The rest of the navigation links -->
          <a href="/" class="block mt-4 text-lg">
            <div class="flex flex-row items-center">
              <HomeIcon className="w-6 mr-2" />
              {#if $isExpanded}
                <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>Home</span>
              {/if}
            </div>
          </a>
          <a href="/" class="block mt-4 text-lg">
            <div class="flex flex-row items-center">
              <BettingIcon className="w-6 mr-2" /> 
              {#if $isExpanded}
              <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>Match Betting</span>
              {/if}
            </div>
          </a>
          <a href="/" class="block mt-4 text-lg">
            <div class="flex flex-row items-center">
              <GamesIcon className="w-6 mr-2" /> 
              {#if $isExpanded}
              <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>Mini Games</span>
              {/if}
            </div>
          </a>
          <a href="/euro2024" class="block mt-4 text-lg">
            <div class="flex flex-row items-center">
              <StarIcon className="w-6 mr-2" /> 
              {#if $isExpanded}
              <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>Euro 2024</span>
              {/if}
            </div>
          </a>
          <a href="/" class="block mt-4 text-lg">
            <div class="flex flex-row items-center">
              <RulesIcon className="w-6 mr-2" /> 
              {#if $isExpanded}
              <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>Rules</span>
              {/if}
            </div>
          </a>
        </div>
      </div>
  
      <div class="mb-4">
        {#if $isExpanded}
          <span in:fade={{ delay: 100, duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>User</span>
        {/if}
      </div>
    </div>
    
    <div class="flex-1">
      <p>Main content goes here. Click icons to navigate.</p>
    </div>
</div>
{/await}

<Toasts />
<BusyScreen />

<style>
  .transition-width {
    transition: width 300ms;
  }
</style>