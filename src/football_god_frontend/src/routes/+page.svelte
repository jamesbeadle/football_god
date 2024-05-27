<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { toastsError } from "$lib/stores/toasts.store";
  import Layout from "./Layout.svelte";
  import { Spinner } from "@dfinity/gix-components";
  import { writable } from "svelte/store";
  import FootballIcon from "$lib/icons/FootballIcon.svelte";
  import OpenChatIcon from "$lib/icons/OpenChatIcon.svelte";
  import { authSignedInStore } from "$lib/derived/auth.derived";
  import { authStore, type AuthSignInParams, type AuthStoreData } from "$lib/stores/auth.store";

  let isLoggedIn = false;
  let isLoading = true;
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

      const endDate = new Date("June 14, 2024 00:00:00 GMT+20:00").getTime();
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
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
      title: "Lightpaper",
      content: "Read the FootballGod lightpaper.",
      link: "/lightpaper",
      icon: null,
      image: "whitepaper.jpg",
      buttonText: "Read",
    },
    {
      title: "Join our OpenChat Community",
      content:
        "Stay up to date with FootballGod developments through our OpenChat community.",
      link: "https://oc.app/community/ji74r-lqaaa-aaaar-ayhoq-cai/?ref=zv6hh-xaaaa-aaaar-ac35q-cai",
      icon: OpenChatIcon,
      buttonText: "Join",
    },
    {
      title: "OpenFPL",
      content:
        "Play decentralised fantasy football for your chance to win $FPL tokens for free.",
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
          <p class="text-xl">$FPL Prediction Sweepstake</p>
          <p class="text-4xl font-bold">Euro 2024</p>
          <p class="text-xl">
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
          
          <div
            class="overlay-panel h-10 rounded-tl-lg w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/4 bg-DARK flex items-center px-1 md:px-4"
          >
            <FootballIcon className="w-6 mr-2" />
            <p class="text-white text-sm font-bold">Euro2024&nbsp;</p>
            <p class="text-white text-sm">| {$countdown}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mr-2 py-2">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
         {#each tiles as tile}
          <div class="flex flex-col bg-gray-700 rounded-lg overflow-hidden">
            {#if tile.image}
              <img
                class="w-full h-96 object-cover min-h-96"
                src={tile.image}
                alt={tile.title}
              />
              <div class="p-4 flex flex-col justify-between h-full">
                <h3 class="text-xl font-bold min-h-[30px]">{tile.title}</h3>
                <p class="min-h-[100px]">{tile.content}</p>
                <a
                  href={tile.link}
                  class="self-end btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  target={tile.link.startsWith("http") ? "_blank" : "_self"}
                  rel={tile.link.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {tile.buttonText}
                </a>
              </div>
            {:else if tile.icon}
              <div class="flex flex-row items-center">
                <svelte:component this={tile.icon} className="h-84 w-full p-24" />
              </div>
              <div class="p-4 flex flex-col justify-between h-full">
                <h3 class="text-xl font-bold min-h-[30px]">{tile.title}</h3>
                <p class="min-h-[100px]">{tile.content}</p>
                <a
                  href={tile.link}
                  class="self-end btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  target={tile.link.startsWith("http") ? "_blank" : "_self"}
                  rel={tile.link.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {tile.buttonText}
                </a>
              </div>
            {/if}
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
