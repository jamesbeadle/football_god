<script lang="ts">

  import { onMount } from "svelte";
  import type { OptionIdentity } from "$lib/types/identity";
  import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
  import TabPanel from "$lib/components/shared/tab-panel.svelte";
  import ProfileDetail from "$lib/components/profile/profile-detail.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  
  let isLoading = $state(true);
  let activeTab: string = $state("details");
  let identity: OptionIdentity | undefined = $state(undefined);

  const tabs = [
    { id: "details", label: "Details" }
  ];
  
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

<div class="page-panel">
  <TabPanel {activeTab} {setActiveTab} {tabs} />

  {#if isLoading}
    <FullScreenSpinner message='Loading Profile' />
  {:else}
    {#if identity}
      {#if activeTab === "details"}
        <ProfileDetail />
      {/if}
    {:else}
       <button class="brand-button" onclick={handleLogin}>Connect</button>
    {/if}
  {/if}

</div>