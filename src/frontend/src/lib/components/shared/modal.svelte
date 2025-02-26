<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade, scale } from "svelte/transition";

  export let showModal: boolean;
  export let onClose: () => void;
  export let useFixedPosition = false;

  let scrollY: number;
  let isMobile: boolean;
  let isDragging = false;

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
    const target = e.target as HTMLElement;
    if (!modalContent?.contains(target) && !isDragging) {
      onClose();
    }
  };

  const handleMouseDown = () => {
    isDragging = false;
  };

  const handleMouseMove = () => {
    isDragging = true;
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isDragging = false;
    }, 0);
  };
</script>

{#if showModal}
<div
  class="fixed inset-0 z-50 overflow-visible bg-black bg-opacity-50 shadow-lg modal-backdrop"
  aria-hidden="true"
  on:click={handleBackdropClick}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  in:fade={{ duration: 2000 }}
  out:fade={{ duration: 2000 }}
>
  <div 
    class="border-2 shadow-md rounded-lg border-BrandPurple/50 {!useFixedPosition ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'absolute'} 
           w-full max-w-lg px-4 md:px-0"
    style={useFixedPosition ? `top: ${modalTop}px; transform: translate(-50%, -50%); left: 50%;` : ''}
  >
    <div
      class="bg-BrandLightGray rounded-lg w-full overflow-y-auto max-h-[90vh] px-4 py-4 md:px-6"
      role="dialog"
      aria-modal="true"
      in:scale={{ duration: 2000 }}
      out:scale={{ duration: 2000 }}
    >
      <slot />
    </div>
  </div>
</div>
{/if}