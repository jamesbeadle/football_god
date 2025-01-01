<script lang="ts">
  import { onMount } from "svelte";
  import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
  import Layout from "../Layout.svelte";
  import ProfileDetail from "$lib/components/profile/profile-detail.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
    import type { OptionIdentity } from "$lib/types/identity";
  
  let isLoading = true;
  let activeTab: string = "details";
  let identity: OptionIdentity;
  
  onMount(async () => {
    await authStore.sync();
    authStore.subscribe((store) => {
      identity = store.identity;
    });
    isLoading = false;
  });

  function setActiveTab(tab: string): void {
    activeTab = tab;
  }

  async function handleLogin() {
      let params: AuthSignInParams = {
          domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
      };
      await authStore.signIn(params);
      authStore.subscribe((store) => {
        identity = store.identity;
      });
  }
  
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    {#if identity}
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
    {:else}
    <button
      class={`flex items-center justify-center px-4 py-2 space-x-2
        bg-BrandPurple hover:bg-BrandPurpleDark text-white rounded transition-all`}
      on:click={handleLogin}
  >
  Connect
  </button>
    {/if}
  {/if}
</Layout>