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
  import { page } from '$app/stores';

  let isExpanded = writable(false);
  let links = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Match Betting', icon: BettingIcon, href: '/betting' },
    { name: 'Mini Games', icon: GamesIcon, href: '/games' },
    { name: 'Euro 2024', icon: StarIcon, href: '/euro2024' },
    { name: 'Rules', icon: RulesIcon, href: '/rules' },
  ];

  let worker: { syncAuthIdle: (auth: AuthStoreData) => void } | undefined;

  const init = async () => await Promise.all([syncAuthStore()]);

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


  onMount(async () => (worker = await initAuthWorker()));
  $: activeRoute = $page.url.pathname;

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
    class="bg-GRAY text-white flex flex-col justify-between transition-width duration-300 p-5"
    style="width: {$isExpanded ? '16rem' : '4rem'}">
      <div>
        <button on:click={() => $isExpanded = !$isExpanded} class="mb-4">
          <span>{$isExpanded ? '<<' : '>>'}</span>
        </button>
  
        <div class="text-gray-400 flex flex-col">
          <a href="/" class="block mt-4 text-lg my-4">
            <div class="flex flex-row items-center">
              <LogoIcon className="w-6 mr-2" />
              {#if $isExpanded}
                <span in:fade={{ duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>FootballGod</span>
              {/if}
            </div>
          </a>
          {#each links as link}
            <a href="{link.href}" 
              class:active="{activeRoute === link.href}"
              rel="prefetch"
              class="block mt-4 text-lg">
              <div class="flex flex-row items-center">
                <svelte:component this={link.icon} className="w-6 mr-2" fill="{activeRoute === link.href ? "white" : "gray"}" />
                {#if $isExpanded}
                  <span in:fade={{ duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>{link.name}</span>
                {/if}
              </div>
            </a>
          {/each}

        </div>
      </div>
  
      <div class="mb-4">
        {#if $isExpanded}
          <span in:fade={{ duration: 200 }} out:fade={{ delay: 0, duration: 100 }}>User</span>
        {/if}
      </div>
    </div>
    
    <div class="flex-1">
      <slot />
    </div>
</div>
{/await}

<Toasts />
<BusyScreen />

<style>
  .transition-width {
    transition: width 200ms;
  }
  a.active {
    color: white !important;
  }
</style>