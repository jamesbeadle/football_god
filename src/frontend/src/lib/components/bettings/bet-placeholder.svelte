<script lang="ts">
    import OpenFplIcon from "$lib/icons/OpenFPLIcon.svelte";
    import Modal from "../shared/modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;

  function cancelModal() {
    closeModal();
  }

</script>

<Modal showModal={visible} onClose={closeModal}>
  <div class="flex justify-between items-center my-2">
    <h3 class="default-header">
      <span class="flex flex-row items-center">
        <OpenFplIcon className="w-8 h-8 mr-1" />
        Coming Soon
      </span>
    </h3>
    <button class="times-button" on:click={cancelModal}>&times;</button>
  </div>

  <div class="flex justify-start items-center w-full">
      <div class="w-full flex-col space-y-4 mb-2">
        <p>Gambling in your region is currently disabled, please check back soon.</p>
      </div>
  </div>
</Modal>





