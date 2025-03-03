<script lang="ts">
  import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
  import { goto } from "$app/navigation";
  import LandingPageDisplay from "./landing-page-display.svelte";
  
  async function handleLoginClick() {
      let params: AuthSignInParams = {
          domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
      };
      await authStore.signIn(params);
      goto("/", {invalidateAll: true});
  }
</script>

<div class="flex flex-col w-full h-screen space-y-4 md:bg-BrandGray md:p-3 md:flex-row">
    <div class="relative flex flex-col w-full h-full bg-center bg-cover md:rounded-lg md:w-1/2" style="background-image: url('background.jpg')">
        <div class="items-end h-full p-4 md:flex bg-gradient-to-t from-black/70 to-transparent md:rounded-lg">
                <h1 class="hidden w-full text-2xl font-bold text-center lg:text-3xl md:block md:pb-8 lg:pb-0">
                    A Fully Decentralised Dataset Owned By The Fans
                </h1>
                <div class="flex items-center justify-center min-h-[55%] mx-4 my-24 rounded-lg bg-BrandGray md:hidden">
                    <LandingPageDisplay {handleLoginClick} />
                </div>
    
            <div class="pt-4 pb-6 md:hidden">
                <h2 class="mx-4 text-2xl text-center xxs:pb-8 text-bold md:hidden">
                    A Fully Decentralised Dataset Owned By The Fans
                </h2>
            </div>
        </div>
    </div>
    <div class="items-center justify-center hidden w-1/2 h-full md:flex">
        <LandingPageDisplay {handleLoginClick} />
    </div>
</div>