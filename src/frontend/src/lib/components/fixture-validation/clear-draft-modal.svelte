<script lang="ts">

  import Modal from "../shared/modal.svelte"; 

  interface Props {
    visible: boolean;
    onConfirm: () => void;
    closeModal: () => void;
  }
  let { visible, onConfirm, closeModal }: Props = $props();

</script>

<Modal title="Clear Draft" {visible} onClose={closeModal}>
  <div class="mx-4 p-4">
    <div class="flex justify-between items-center my-2">
      <h3 class="page-title">Clear Draft</h3>
      <button class="times-button" onclick={closeModal}>&times;</button>
    </div>

    <p>Please confirm you want to clear the draft from your cache.</p>

    <div class="items-center py-3 flex space-x-4">
      <button
        class="brand-cancel-button"
        type="button"
        onclick={closeModal}
      >
        Cancel
      </button>
      <button class="brand-button" onclick={onConfirm}>
        Clear
      </button>
    </div>
  </div>
</Modal>
