<script lang="ts">
    import { onDestroy } from "svelte";
  
    export let showModal: boolean;
    export let onClose: () => void;
  
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        onClose();
      }
    };
  
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeydown);
    }
  
    onDestroy(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeydown);
      }
    });
  
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  </script>
  
  {#if showModal}
    <div
      class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
      aria-hidden="true"
      on:click={handleBackdropClick}
    >
      <div
        class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto relative text-black"
        role="dialog"
        aria-modal="true"
      >
        <button
          on:click={onClose}
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ×
        </button>
        <slot />
      </div>
    </div>
  {/if}
  