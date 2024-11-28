<script lang="ts">
  import { onDestroy, afterUpdate } from "svelte";

  export let showModal: boolean;
  export let onClose: () => void;

  let modalContainer: HTMLElement | null = null;

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal) {
      onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const trapFocus = () => {
    if (modalContainer && showModal) {
      const focusableElements = modalContainer.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalContainer.focus();
      }
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

  afterUpdate(() => {
    if (showModal) {
      trapFocus(); 
    }
  });
</script>

{#if showModal}
<div
  class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto"
  on:click={handleBackdropClick}
  aria-hidden={showModal ? "false" : "true"}
>
<div
class="bg-BrandLightGray rounded-lg shadow-lg max-w-lg w-full mx-auto relative overflow-y-auto max-h-[90vh] px-6 py-4"
role="dialog"
aria-modal="true"
tabindex="-1" 
bind:this={modalContainer}
>
<slot />
</div>

</div>
{/if}
