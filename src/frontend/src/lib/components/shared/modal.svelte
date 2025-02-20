<script lang="ts">
  import { onDestroy } from "svelte";

  export let showModal: boolean;
  export let onClose: () => void;

  let scrollY: number;
  let isMobile: boolean;

  $: if (typeof window !== 'undefined' && showModal) {
    scrollY = window.scrollY;
    isMobile = window.innerWidth < 768;
  }

  $: modalTop = isMobile 
    ? scrollY + (window.innerHeight * 0.45) 
    : scrollY + (window.innerHeight / 2);

  $: if (typeof window !== 'undefined') {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

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
      document.body.style.overflow = 'auto';
    }
  });

  const handleBackdropClick = (e: MouseEvent) => {
    const modalContent = document.querySelector('[role="dialog"]');
    if (!modalContent?.contains(e.target as Node)) {
      onClose();
    }
  };
</script>

{#if showModal}
<div
  class="fixed inset-0 z-40 bg-black bg-opacity-50 shadow-lg"
  aria-hidden="true"
  on:click={handleBackdropClick}
>
  <div 
    class="absolute w-full max-w-lg px-4 left-1/2 md:px-0"
    style="top: {modalTop}px; transform: translate(-50%, -50%);"
  >
    <div
      class="bg-BrandLightGray rounded-lg w-full overflow-y-auto max-h-[80vh] md:max-h-[90vh] px-4 py-4 md:px-6"
      role="dialog"
      aria-modal="true"
    >
      <slot />
    </div>
  </div>
</div>
{/if}