<script lang="ts">
  import Modal from "../shared/global/modal.svelte";

  interface Props {
    visible: boolean;
    onConfirm: () => void;
    closeModal: () => void;
  }
  let { visible, onConfirm, closeModal }: Props = $props();

</script>

<Modal title="Confirm Fixture Data Submission" onClose={closeModal}>
  <div class="p-4 mx-4">
    <div class="flex items-center justify-between my-2">
      <h4>Confirm Fixture Data</h4>
      <button class="text-black" onclick={closeModal}>✕</button>
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
        onclick={closeModal}>Cancel</button
      >
      <button class="brand-button" onclick={onConfirm}
        >Confirm</button
      >
    </div>
  </div>
</Modal>
