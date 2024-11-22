<script lang="ts">
  import Modal from "../shared/modal.svelte"; 
  export let visible = false;
  export let onConfirm: () => void;
  export let closeModal: () => void;
</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="default-header">Clear Draft</h3>
      <button class="times-button" on:click={closeModal}>&times;</button>
    </div>

    <p>Please confirm you want to clear the draft from your cache.</p>

    <div class="items-center py-3 flex space-x-4">
      <button
        class="brand-cancel-button"
        type="button"
        on:click={closeModal}
      >
        Cancel
      </button>
      <button class="brand-button" on:click={onConfirm}>
        Clear
      </button>
    </div>
  </div>
</Modal>
