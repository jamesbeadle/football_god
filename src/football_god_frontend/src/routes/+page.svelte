<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { authStore } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import Layout from "./Layout.svelte";
  import { Spinner } from "@dfinity/gix-components";
  import { writable } from 'svelte/store';
  import FootballIcon from "$lib/icons/FootballIcon.svelte";
  import OpenChatIcon from "$lib/icons/OpenChatIcon.svelte";
  import OpenFPLIcon from "$lib/icons/OpenFPLIcon.svelte";

  let isLoggedIn = false;
  let isLoading = true;
  const countdown = writable('');

  type TileData = {
    title: string,
    content: string,
    link: string,
    image?: string,
    icon?: any,
    buttonText: string
  };

  onMount(async () => {
    try {
      await authStore.sync();

      authStore.subscribe((store) => {
        isLoggedIn = store.identity !== null && store.identity !== undefined;
      });

      const endDate = new Date('June 14, 2024 00:00:00 GMT+20:00').getTime();
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        countdown.set(`Kick Off: ${days}d ${hours}h ${minutes}m`);
      };
      
      updateCountdown(); // Run once on component mount
      const interval = setInterval(updateCountdown, 60000); // Update every minute

      onDestroy(() => {
        clearInterval(interval); // Clear the interval when the component is destroyed
      });
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

  let tiles: TileData[] = [
    {
      title: 'Whitepaper',
      content: 'Read the FootballGod whitepaper.',
      link: '/whitepaper',
      icon: null,
      image: 'whitepaper.jpg',
      buttonText: 'Read'
    },
    {
      title: 'Join our OpenChat Community',
      content: 'Stay up to date with FootballGod developments through our OpenChat community.',
      link: 'https://oc.app/community/ji74r-lqaaa-aaaar-ayhoq-cai/?ref=zv6hh-xaaaa-aaaar-ac35q-cai',
      icon: OpenChatIcon,
      buttonText: 'Join'
    },
    {
      title: 'OpenFPL',
      content: 'Play decentralised fantasy football for your chance to win $FPL tokens for free.',
      link: 'https://openfpl.xyz',
      image: 'openfpl.png',
      buttonText: 'Play'
    }
  ];
</script>

<Layout>
  {#if isLoading}
    <Spinner />
  {:else}
    
    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
      <div class="bg-cover bg-center bg-no-repeat py-20 px-4"
          style="background-image: url('banner.jpg');">
        <div class="container ml-4 flex flex-col justify-between">
          <p class="text-xl">$ICP Prediction Sweepstake</p>
          <p class="text-4xl font-bold">Euro 2024</p>
          <p class="text-xl">Enter up until Friday 14th June 2024</p>
          <button class="btn bg-DARK mt-4 py-4 w-48 rounded-md">Enter Now</button>
          <div class="overlay-panel h-10 rounded-tl-lg w-11/12 md:w-1/4 bg-DARK flex items-center px-1 md:px-4">
            <FootballIcon className="w-6 mr-2"  />
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
              <img class="w-full h-96 object-cover" src={tile.image} alt={tile.title} />
              <div class="p-4 flex flex-col justify-between h-full">
                <p><b>{tile.title}: </b>{tile.content}</p>
                <a href={tile.link}
                  class="self-end btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  {...(tile.link.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {tile.buttonText}
                </a>

              </div>
            {:else if tile.icon}
              <div class="flex flex-row items-center">
                <svelte:component this={tile.icon} className="h-96 p-8" />
                <h3 class="text-xl font-bold">{tile.title}</h3>
              </div>
              <div class="p-4 flex flex-col justify-between h-full">
                <p>{tile.content}</p>
                <a href={tile.link}
                  class="self-end btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  {...(tile.link.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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