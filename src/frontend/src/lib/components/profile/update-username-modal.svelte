<script lang="ts">
  import { userStore } from "$lib/stores/user-store";
  import Modal from "../shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let cancelModal: () => void;
  export let newUsername: string = "";

  function isDisplayNameValid(displayName: string): boolean {
    if (!displayName) {
      return false;
    }

    if (displayName.length < 3 || displayName.length > 20) {
      return false;
    }

    return /^[a-zA-Z0-9 ]+$/.test(displayName);
  }

  $: isSubmitDisabled = !isDisplayNameValid(newUsername);

  async function updateUsername() {
    try {
      await userStore.updateUsername(newUsername);
      await closeModal();
    } catch (error) {
      console.error("Error updating username:", error);
      cancelModal();
    } finally {
    }
  }
</script>

{#if visible}
  <Modal onClose={closeModal}>
    <div class="p-4 mx-4">
      <div class="flex items-center justify-between my-2">
        <h3 class="default-header">Update Display Name</h3>
        <button class="times-button" on:click={cancelModal}>&times;</button>
      </div>
      <form on:submit|preventDefault={updateUsername}>
        <div class="mt-4">
          <input
            type="text"
            class="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Username"
            bind:value={newUsername}
          />
        </div>
        <div class="flex flex-row items-center py-3 space-x-4">
          <button
            class="px-4 py-2 brand-cancel-button"
            type="button"
            on:click={cancelModal}
          >
            Cancel
          </button>
          <button
            class={`px-4 py-2 ${
              isSubmitDisabled ? "brand-button-disabled" : "brand-button"
            } `}
            type="submit"
            disabled={isSubmitDisabled}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </Modal>
{/if}