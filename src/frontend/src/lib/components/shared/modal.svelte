<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import CrossIcon from "$lib/icons/CrossIcon.svelte";

  export let showModal: boolean;
  export let onClose: () => void;
  export let closeOnClickOutside = true;

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

  onDestroy(() => {
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
    if (closeOnClickOutside && startOnBackdrop && e.target === e.currentTarget) {
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
    class="fixed inset-0 z-50 overflow-visible bg-black bg-opacity-50 shadow-lg modal-backdrop"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:pointerdown={handlePointerDown}
    on:pointerup={handlePointerUp}
  >
    <div
      bind:this={modalElement}
      class="w-full max-w-lg mx-4 text-white rounded shadow outline-none bg-BrandLightGray md:max-w-3xl focus:outline-none"
      tabindex="-1"
    >
      <header class="flex items-center justify-between p-4">
        <button
          type="button"
          class="text-black"
          aria-label="Close modal"
          on:click={onClose}
        >
          <CrossIcon className="w-4" fill='white' />
        </button>
      </header>
      <div class="bg-Brand p-6 rounded-b-lg overflow-auto max-h-[80vh]">
        <div class=""></div>
        <slot />
      </div>
    </div>
  </div>
{/if}