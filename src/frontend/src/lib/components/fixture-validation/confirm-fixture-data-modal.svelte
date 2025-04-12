<script lang="ts">
  import Modal from "../shared/modal.svelte";

  export let visible = false;
  export let onConfirm: () => void;
  export let closeModal: () => void;
</script>

<Modal title="Confirm Fixture Data Submission" {visible} onClose={closeModal}>
  <div class="p-4 mx-4">
    <div class="flex items-center justify-between my-2">
      <h4>Confirm Fixture Data</h4>
      <button class="text-black" on:click={closeModal}>✕</button>
    </div>
    <div class="my-5 space-y-2">
      <h1 class="text-lg text-white">Please confirm your fixture data.</h1>
      <p class="text-base text-white/70">
        You will not be able to edit your submission and entries that differ
        from the accepted consensus data will not receive $ICFC rewards. If
        consensus has already been reached for the fixture your submission will
        also not be counted.
      </p>
    </div>
    <div class="flex justify-end gap-3">
      <button
        class="brand-cancel-button"
        type="button"
        on:click={closeModal}>Cancel</button
      >
      <button class="brand-button" on:click={onConfirm}
        >Confirm</button
      >
    </div>
  </div>
</Modal>
