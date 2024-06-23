<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { initAuthWorker } from "$lib/services/worker.auth.services";

  import { authStore, type AuthSignInParams, type AuthStoreData } from "$lib/stores/auth.store";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import { toastsError } from "$lib/stores/toasts.store";
  import { writable } from "svelte/store";
  import { BusyScreen, Spinner, Toasts } from "@dfinity/gix-components";
  import LogoIcon from "$lib/icons/LogoIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import BettingIcon from "$lib/icons/BettingIcon.svelte";
  import GamesIcon from "$lib/icons/GamesIcon.svelte";
  import StarIcon from "$lib/icons/StarIcon.svelte";
  import { fade } from "svelte/transition";
  import "../app.css";
  import { page } from "$app/stores";
  import ProfileIcon from "$lib/icons/ProfileIcon.svelte";
  import LogoutIcon from "$lib/icons/LogoutIcon.svelte";
  import { signOut } from "$lib/services/auth.services";
  import Tooltip from "$lib/components/tooltip.svelte";
  import WhitepaperIcon from "$lib/icons/WhitepaperIcon.svelte";

  let isExpanded = writable(false);
  $: links = $authSignedInStore ? [
    { name: "Home", icon: HomeIcon, href: "/" },
    { name: "Euro 2024", icon: StarIcon, href:  "/leaderboard" },
    { name: "Profile", icon: ProfileIcon, href: "/profile" },
    { name: "Whitepaper", icon: WhitepaperIcon, href: "/whitepaper" },
  ] : 
  [
    { name: "Home", icon: HomeIcon, href: "/" }
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



  function handleLogin() {
    let params: AuthSignInParams = {
      domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
    };
    authStore.signIn(params);
  }

  async function handleLogout() {
    await authStore.signOut();
  }


</script>

<svelte:window on:storage={syncAuthStore} />
{#await init()}
  <div in:fade>
    <Spinner />
  </div>
{:then _}
  <div class="flex h-screen">
    <div
      class="bg-GRAY text-white flex flex-col justify-between transition-width duration-300 p-5 rounded-lg m-2"
      style="width: {$isExpanded ? '16rem' : '4rem'}"
    >
    <div class="flex flex-col flex-grow">
      <button on:click={() => ($isExpanded = !$isExpanded)} class="mb-4">
          <span>{$isExpanded ? "<<" : ">>"}</span>
        </button>

        <div class="text-gray-400 flex flex-col">
          <a href="/" class="block mt-4 text-lg my-4">
            <div class="flex flex-row items-center">
              <LogoIcon className="w-6 mr-2" />
              {#if $isExpanded}
                <span
                  in:fade={{ duration: 200 }}
                  out:fade={{ delay: 0, duration: 100 }}>FootballGod</span
                >
              {/if}
            </div>
          </a>
          {#each links as link}
            <a
              href={link.href}
              class:active={activeRoute === link.href}
              rel="prefetch"
              class="block mt-4 text-lg"
            >
              <div class="flex flex-row items-center">

                <Tooltip text={link.name}>
                  <svelte:component
                    this={link.icon}
                    className="w-6 mr-2"
                    fill={activeRoute === link.href ? "white" : "gray"}
                  />
                </Tooltip>
                {#if $isExpanded}
                  <span
                    in:fade={{ duration: 200 }}
                    out:fade={{ delay: 0, duration: 100 }}>{link.name}</span
                  >
                {/if}
              </div>
            </a>
          {/each}
        </div>
      </div>
      {#if $authSignedInStore && !$isExpanded}
        <button on:click={signOut} in:fade>
          <Tooltip text="Logout">
            <LogoutIcon className="max-w-6" />
          </Tooltip>
        </button>
      {/if}
      

      <div class="mb-4">
        {#if $isExpanded}
          {#if $authSignedInStore}
            <button on:click={handleLogout} class="button-hover p-2 rounded-md text-sm w-full"
                in:fade={{ duration: 200 }}
                out:fade={{ delay: 0, duration: 100 }}>Disconnect</button
              >
          {:else}
            <button on:click={handleLogin} class="bg-OPENFPL hover:bg-OPENFPL hover:text-GRAY p-2 rounded-md text-sm w-full"
                in:fade={{ duration: 200 }}
                out:fade={{ delay: 0, duration: 100 }}>Connect Internet Identity</button
              >
          {/if}
        {/if}
      </div>
    </div>

    <div class="flex-1">
      <slot />
    </div>
    <Toasts />
  </div>
{/await}

<BusyScreen />

<style>
  .transition-width {
    transition: width 200ms;
  }
  a.active {
    color: white !important;
  }
</style>
