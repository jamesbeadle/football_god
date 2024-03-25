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
        <div class="overlay-panel h-10 rounded-tl-lg w-96 bg-DARK flex items-center px-4">
          <FootballIcon className="w-6 mr-2"  />
          <p class="text-white text-sm font-bold">Euro2024&nbsp;</p>
          <p class="text-white text-sm">| {$countdown}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="text-white p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-GRAY rounded-lg p-4">
        <h3 class="text-xl font-bold mb-2">Whitepaper</h3>
        <img alt="whitepaper" src="whitepaper.jpg" />
        <p>Content goes here...</p>
      </div>
      <div class="bg-GRAY rounded-lg p-4">
        <div class="flex flex-rpw"></div>
        <h3 class="text-xl font-bold mb-2">Join our OpenChat Community</h3>
        <OpenChatIcon className="w-16 m-6" />
        <a href="https://oc.app/community/ji74r-lqaaa-aaaar-ayhoq-cai/?ref=zv6hh-xaaaa-aaaar-ac35q-cai">Here</a>
      </div>
      <div class="bg-GRAY rounded-lg p-4 md:col-span-2 lg:col-span-1">
        <h3 class="text-xl font-bold mb-2">Play OpenFPL</h3>
        <OpenFPLIcon />
        <p>Content goes here...</p>
      </div>
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