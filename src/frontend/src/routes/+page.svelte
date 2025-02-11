<script lang="ts">
  import { onMount } from "svelte";

  import Layout from "./Layout.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import ProposalsList from "$lib/components/governance/proposals-list.svelte";

  let isLoading = true;


  onMount(async () => {
    try {
      
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      isLoading = false;
    }
  });

</script>

<Layout>
  <div class="flex flex-col md:flex-row">
    <div class="flex-1 md:block">
      {#if isLoading}
        <FullScreenSpinner />
      {:else}
        <div class="page-panel">
          <ProposalsList />
        </div>
      {/if}
    </div>
  </div>
</Layout>