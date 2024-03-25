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
  <div class="bg-panel rounded-md p-4 mt-4 text-white">
    <h1 class="default-header">Welcome</h1>
  </div>
  {/if}
</Layout>