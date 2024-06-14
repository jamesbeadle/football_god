<script lang="ts">
    import type {
      Euro2024PredictionDTO,
    } from "../../../../declarations/football_god_backend/football_god_backend.did";
    import Layout from "../Layout.svelte";
    import { onMount, onDestroy, SvelteComponent } from "svelte";
    import SelectTeamComponent from "$lib/components/euro2024/select-team-modal.svelte";
    import SelectPlayerComponent from "$lib/components/euro2024/select-player-modal.svelte";
    import { teamStore } from "$lib/stores/teams.store";
    import { playerStore } from "$lib/stores/player.store";
    import { writable } from "svelte/store";
    import { userStore } from "$lib/stores/user.store";
    import { isError } from "$lib/utils/helpers";
    import { toastsError, toastsShow } from "$lib/stores/toasts.store";
    import OpenChatIcon from "$lib/icons/OpenChatIcon.svelte";
    import { Collapsible, Spinner } from "@dfinity/gix-components";
    import ConfirmSelectionModal from "$lib/components/euro2024/confirm-selection-modal.svelte";
    import { euro2024Store } from "$lib/stores/euro2024.store";
    import { authSignedInStore } from "$lib/derived/auth.derived";
    import { authStore, type AuthSignInParams } from "$lib/stores/auth.store";
    import { goto } from "$app/navigation";
   
    let isLoading = true;
    let principalId = "";
    $: loadingText = "Loading, please wait...";
  
    onMount(async () => {
      authStore.subscribe((store) => {
        if(store.identity == null || store.identity == undefined){
          goto('/');
        }
      });
      isLoading = false;
    });
  
    async function giftEntry() {
      try {
        isLoading = true;
        loadingText = "Gifting Entry";
        let result = await userStore.giftEntry(principalId);
        if (isError(result)) {
          toastsError({
            msg: { text: "Error gifting euro 2024 entry." },
            err: null,
          });
          console.error("Error gifting euro 2024 entry.", null);
        } 
        
        toastsShow({
          text: "Euro 2024 entry fee gifted to user.",
          level: "success",
          duration: 2000,
        });
      } catch (error) {
        toastsError({
          msg: { text: "Error gifting euro 2024 entry." },
          err: error,
        });
        console.error("Error gifting euro 2024 entry", error);
      } finally {
        isLoading = false;
      }
    }
  
  
    function handleLogin() {
      let params: AuthSignInParams = {
        domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
      };
      authStore.signIn(params);
    }
  
  </script>
  
  <Layout>
  
    {#if !$authSignedInStore}
      <p>Please sign in to gift an entry.</p>
    {:else}
  
      {#if isLoading}
        <Spinner />
        <div class="fixed inset-0 flex flex-col items-center justify-center">
          <p class="mt-24">{loadingText}</p>
        </div>
      {:else}

        <div class="bg-panel rounded-md p-4">
          <p class="text-sm md:text-xl my-2 mb-4">
            Gift a Euro 2024 entry to a user.
          </p>
  
          <div class="horizontal-divider my-4" />
  
          <input
              type="text"
              id="principalId"
              bind:value={principalId}
              class="bg-gray-900 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the users FootballGod Principal ID."
            />
  
          <div class="bg-panel rounded-md p-4 mt-4">
            <div class="flex justify-center">
              <button
                on:click={giftEntry}
                type="submit"
                class="bg-OPENFPLPURPLE hover:bg-OPENFPL hover:text-GRAY focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex justify-center px-4 py-2 border border-transparent shadow-sm font-bold rounded-md text-white"
              >
                <p class="text-xl px-4">
                  Save<br /> 
                </p>
              </button>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  
  </Layout>
  