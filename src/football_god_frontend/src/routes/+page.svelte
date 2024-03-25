<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { authStore } from "$lib/stores/auth.store";
  import { toastsError } from "$lib/stores/toasts.store";
  import Layout from "./Layout.svelte";
  import { Spinner } from "@dfinity/gix-components";
  let isLoggedIn = false;
  let isLoading = true;

  onMount(async () => {
    try {
      await authStore.sync();

      authStore.subscribe((store) => {
        isLoggedIn = store.identity !== null && store.identity !== undefined;
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
          <p class="text-4xl">Euro 2024</p>
          <p class="text-xl">Enter up until Friday 14th June 2024</p>
          <button class="btn bg-BLACK mt-4 py-4 w-48 rounded-md">Enter Now</button>
        </div>
      </div>
</div>
  {/if}
</Layout>