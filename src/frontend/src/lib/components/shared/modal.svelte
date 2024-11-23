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
  class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto"
  aria-hidden="true"
  on:click={handleBackdropClick}
>
  <div
    class="bg-BrandLightGray rounded-lg shadow-lg max-w-lg w-full mx-auto relative overflow-y-auto max-h-[90vh] px-6 py-4"
    role="dialog"
    aria-modal="true"
  >
    <slot />
  </div>
</div>
{/if}

  