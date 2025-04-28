<script lang="ts">

  import { onMount, type Snippet } from "svelte";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { initAuthWorker } from "$lib/services/worker.auth.services";
  import { displayAndCleanLogoutMsg } from "$lib/services/auth.services";
  import { authStore, type AuthStoreData } from "$lib/stores/auth-store";
  import { userStore } from "$lib/stores/user-store";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import type { Neuron } from "@dfinity/sns/dist/candid/sns_governance";

  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import LoggedInHeader from "$lib/components/shared/logged-in-header.svelte";
  import Sidebar from "$lib/components/shared/sidebar.svelte";
  import LandingPage from "$lib/components/landing/landing-page.svelte";
  import Toasts from "$lib/components/toasts/toasts.svelte";
  import NoNeuronHeader from "$lib/components/shared/no-neuron-header.svelte";
  import HowToStakeIcfc from "$lib/components/shared/how-to-stake-icfc.svelte";
  
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
  let neurons: Neuron[] = $state([]);

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
    await getUserNeurons();
    isLoading = false;
  });

  const init = async () => {
    if (!browser) return;
    await authStore.sync();
    displayAndCleanLogoutMsg();
  };

  $effect(() => {
    if($authSignedInStore){
      getUserNeurons();
    }
  })

  async function getUserNeurons(){
    isLoading = true;
    neurons = await userStore.getNeurons();
    isLoading = false;
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

</script>

<svelte:window on:storage={authStore.sync} />

{#if browser && isLoading}
  <div in:fade>
    <FullScreenSpinner  message='Loading Football God' />
  </div>
{:else}
  {#if $authSignedInStore && neurons.length > 0}
    <LoggedInHeader {toggleMenu} />
    <div class="mx-4 mt-6">
        {@render children()}
    </div>
    <Sidebar {isMenuOpen} {toggleMenu} showOptions={true} />
    <Toasts />
  {:else if isLoading}
    <LocalSpinner />
  {:else if $authSignedInStore && neurons.length == 0}
    <NoNeuronHeader {toggleMenu} />
    <div class="mx-4 mt-6">
      <HowToStakeIcfc {getUserNeurons} />
    </div>
    <Sidebar {isMenuOpen} {toggleMenu} showOptions={false} />
  {:else}
    <LandingPage />
  {/if}
{/if}