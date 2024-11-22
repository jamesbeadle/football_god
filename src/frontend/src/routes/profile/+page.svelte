<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth-store";
  import Layout from "../Layout.svelte";
  import ProfileDetail from "$lib/components/profile/profile-detail.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  
  let isLoading = true;
  let activeTab: string = "details";
  
  onMount(async () => {
    await authStore.sync();
    authStore.subscribe((store) => {
      if(store.identity == null || store.identity == undefined){
        goto('/');
      }
    });
    isLoading = false;
  });

  function setActiveTab(tab: string): void {
    activeTab = tab;
  }
  
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <div class="m-4">
      <div class="bg-panel rounded-md">
        <ul
          class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2"
        >
          <li class={`mr-4 ${activeTab === "details" ? "active-tab" : ""}`}>
            <button
              class={`p-2 ${
                activeTab === "details" ? "text-white" : "BrandGray"
              }`}
              on:click={() => setActiveTab("details")}>Profile Detail</button
            >
          </li>
        </ul>

        {#if activeTab === "details"}
          <ProfileDetail />
        {/if}
      </div>
    </div>
  {/if}
</Layout>