<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import CrossIcon from "$lib/icons/CrossIcon.svelte";

  export let showModal: boolean;
  export let onClose: () => void;
  export let title: string;

  let modalElement: HTMLDivElement;
  let startOnBackdrop = false;

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal) {
      onClose();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }

  $: if (typeof document !== 'undefined') {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", handleKeydown);
    }
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (e.target === e.currentTarget) {
      startOnBackdrop = true;
    } else {
      startOnBackdrop = false;
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (startOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
    startOnBackdrop = false;
  };

  onMount(() => {
    if (modalElement && showModal) {
      modalElement.focus();
    }
  });
</script>

{#if showModal}
  <div
    class="fixed inset-0 z-40 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:pointerdown={handlePointerDown}
    on:pointerup={handlePointerUp}
  >
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        bind:this={modalElement}
        class="relative z-50 w-full max-w-lg text-white bg-black rounded shadow outline-none md:max-w-3xl focus:outline-none"
        tabindex="-1"
      >
        <header class="flex items-center justify-between p-4">
          <h2 class="text-xl condensed">{title}</h2>
          <button
            type="button"
            class="text-white"
            aria-label="Close modal"
            on:click={onClose}
          >
            <CrossIcon className="w-4" fill='white' />
          </button>
        </header>
        <div class="bg-BrandBlack rounded-b-lg overflow-auto max-h-[calc(100vh-12rem)]">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}