<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import Layout from "./Layout.svelte";
  import LocalSpinner from "$lib/components/shared/local-spinner.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  import ArrowUp from "$lib/icons/ArrowUp.svelte";

  import { leagueStore } from "$lib/stores/league-store";
  import { clubStore } from "$lib/stores/club-store";
  import { fixtureStore } from "$lib/stores/fixture-store";

  import type {
    ClubDTO,
    LeagueId,
  } from "../../../declarations/data_canister/data_canister.did";

  import type { Category, SelectionDetail } from "../../../declarations/backend/backend.did";

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
          <div class="page-panel-header">Home</div>
          <div class="page-panel-bar-format">
            <p>FootballGod</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</Layout>