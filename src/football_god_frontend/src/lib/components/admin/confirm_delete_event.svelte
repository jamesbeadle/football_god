<script lang="ts">
    import { Modal } from "@dfinity/gix-components";
    
    export let visible = false;
    export let onConfirm: () => void;
    export let onClose: () => void;

    export let eventId: BigInt;
  </script>
  
  <Modal {visible} on:nnsClose={onClose}>
    <div class="mx-4 p-4">
      <div class="flex justify-between items-center mt-2">
        <h4 class="text-red-500">Confirm Delete Entry</h4>
        <button class="text-white" on:click={onClose}>✕</button>
      </div>
      <div class="my-2">
        <h1 class="mb-2 text-red-400 text-sm">Please select confirm to remove the following event:</h1>
        <p class="text-white text-xs">
          {eventId}
        </p>
      </div>
      <div class="flex justify-end gap-3 mt-4 mb-2">
        <button
          class="default-button bg-red-100 px-4 py-2 text-black"
          type="button"
          on:click={onClose}>Cancel</button
        >
        <button class="default-button bg-OPENFPL px-4 py-2" on:click={onConfirm}
          >Confirm</button
        >
      </div>
    </div>
  </Modal>
  