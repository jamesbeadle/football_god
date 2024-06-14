<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import { authStore, type AuthSignInParams } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import Layout from "./Layout.svelte";
  import FootballIcon from "$lib/icons/FootballIcon.svelte";
  import OpenChatIcon from "$lib/icons/OpenChatIcon.svelte";
  import { Spinner } from "@dfinity/gix-components";
    import { euro2024Store } from "$lib/stores/euro2024.store";
    import type { Euro2024State } from "../../../declarations/football_god_backend/football_god_backend.did";
    import { isError } from "$lib/utils/helpers";
    import OpenFplIcon from "$lib/icons/OpenFPLIcon.svelte";
  
  let isLoggedIn = false;
  let isLoading = true;
  let euro2024State: Euro2024State;
  const countdown = writable("");

  type TileData = {
    title: string;
    content: string;
    link: string;
    image?: string;
    icon?: any;
    buttonText: string;
  };

  let interval: NodeJS.Timeout;

  onMount(async () => {
    try {
      await authStore.sync();

      authStore.subscribe((store) => {
        isLoggedIn = store.identity !== null && store.identity !== undefined;
      });

      await euro2024Store.sync();
      let result = await euro2024Store.getEuro2024State();
      if(isError(result)){
        console.error("Error loading Euro2024 state: ", result)
      }

      euro2024State = result.ok;
      
      const endDate = new Date("June 14, 2024 20:00:00 GMT+0100").getTime();
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        countdown.set(`Kick Off: ${days}d ${hours}h ${minutes}m`);
      };

      updateCountdown(); // Run once on component mount
      interval = setInterval(updateCountdown, 60000); // Update every minute
    } catch (error) {
      toastsError({
        msg: { text: "Error fetching homepage data." },
        err: error,
      });
      console.error("Error fetching homepage data:", error);
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  let tiles: TileData[] = [
    {
      title: "Whitepaper",
      content: "Read the FootballGod whitepaper.",
      link: "/whitepaper",
      icon: null,
      image: "whitepaper.jpg",
      buttonText: "Read",
    },
    {
      title: "Transfer Kings",
      content:
        "Our new game 'Transfer Kings' is coming soon.",
      link: "https://transferkings.xyz",
      image: "transferkings.png",
      buttonText: "Play",
    },
    {
      title: "OpenFPL",
      content:
        "Decentralised fantasy football.",
      link: "https://openfpl.xyz",
      image: "openfpl.png",
      buttonText: "Play",
    },
  ];

  function handleLogin() {
    let params: AuthSignInParams = {
      domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
    };
    authStore.signIn(params);
  }
</script>

<Layout>
  {#if isLoading}
    <Spinner />
  {:else}
    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
      <div
        class="bg-cover bg-center bg-no-repeat py-20 px-4"
        style="background-image: url('banner.jpg');"
      >
        <div class="container ml-4 flex flex-col justify-between">
          <p class="text-base md:text-xl">$FPL Prediction Sweepstake</p>
          <p class="text-xl md:text-4xl font-bold">Euro 2024</p>
          
          {#if Object.keys(euro2024State.stage)[0] == 'Selecting'}
          
            <p class="text-sm md:text-xl">
              Play for free or enter the $FPL sweepstake up until Friday 14th June
              2024
            </p>
            {#if $authSignedInStore}
              <a href="/euro2024"
                ><button class="btn bg-DARK mt-4 py-4 w-48 rounded-md"
                  >Enter Now</button
                ></a
              >
            {:else}
                
              <button on:click={handleLogin} class="btn bg-DARK mt-4 py-4 w-48 rounded-md">Connect To Play</button
            >
            {/if}
          
          {/if}

          {#if Object.keys(euro2024State.stage)[0] == 'Active'}
            
            <p class="text-sm md:text-xl">
              Check in on the Euro 2024 Prediction Leaderboard here:
            </p>
            <a href="/leaderboard"
              ><button class="btn bg-DARK mt-4 py-4 w-48 rounded-md"
                >Leaderboard</button
              ></a
            >
                
          {/if}

          {#if Object.keys(euro2024State.stage)[0] == 'Completed'}
              
            <p class="text-sm md:text-xl">
              Check in our Euro 2024 Prediction Competition results here:
            </p>
            <a href="/leaderboard"
              ><button class="btn bg-DARK mt-4 py-4 w-48 rounded-md"
                >Results</button
              ></a
            >
                
          {/if}

          <div
            class="overlay-panel h-10 rounded-tl-lg w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/4 bg-DARK flex items-center px-1 md:px-4 text-xs md:text-sm"
          >
            <FootballIcon className="w-6 mr-2" />
            <p class="text-white  font-bold">Euro2024&nbsp;</p>
            <p class="text-white">| {$countdown}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mr-2 py-2">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each tiles as tile}
          <div class="bg-gray-700 rounded-lg overflow-hidden flex flex-col">
            {#if tile.image}
              <img
                class="w-full h-48 object-cover"
                src={tile.image}
                alt={tile.title}
              />
            {/if}
            {#if tile.icon}
              <div class="flex items-center justify-center h-48 bg-gray-800">
                <svelte:component this={tile.icon} className="h-32 w-32" />
              </div>
            {/if}
            <div class="flex flex-col justify-between flex-grow p-4">
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-white">{tile.title}</h3>
                <p class="mt-2 text-white">{tile.content}</p>
              </div>
              <div class="mt-4 flex justify-end">
                <a
                  href={tile.link}
                  class="bg-black text-white px-4 py-2 rounded"
                  target={tile.link.startsWith("http") ? "_blank" : "_self"}
                  rel={tile.link.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {tile.buttonText}
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
  {/if}
</Layout>

<style>
  .overlay-container {
    position: relative;
  }

  .overlay-panel {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
