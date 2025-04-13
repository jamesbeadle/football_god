<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';
  import { isBusy } from '$lib/stores/busy-store';
  import { handleKeyPress } from '$lib/utils/keyboard.utils';
  import { onMount, onDestroy } from 'svelte';
  import CrossIcon from '$lib/icons/CrossIcon.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    onClose: () => void;
    title: string;
    children: Snippet;
    visible: boolean;
  }

  let { children, onClose, title, visible }: Props = $props();

  const close = (): void => {
    if ($isBusy) return;
    visible = false;
    onClose(); 
  };

  const onCloseHandler = ($event: MouseEvent | TouchEvent): void => {
    $event.stopPropagation();
    close();
  };

  onMount(() => {
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    document.body.style.overflow = '';
  });

  function portal(node: HTMLElement): { destroy: () => void } {
    document.body.appendChild(node);
    return {
      destroy() {
        document.body.removeChild(node);
      }
    };
  }
</script>

{#if visible}
  <div
    class="modal-background"
    out:fade
    role="dialog"
    aria-labelledby="modalTitle"
    aria-describedby="modalContent"
    use:portal
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-50 cursor-pointer"
      onclick={onCloseHandler}
      onkeypress={($event: KeyboardEvent) => handleKeyPress({ $event, callback: close })}
      role="button"
      tabindex="-1"
    ></div>
    <div 
      transition:scale={{ delay: 25, duration: 150, easing: quintOut }} 
      class="relative w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-[1400px] mx-auto p-4 sm:p-6"
    >
      <div 
        class="bg-BrandDarkGray border border-BrandGray rounded-lg relative h-[80vh] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transform-style-preserve-3d stacked-col"
      >
        <div class="flex-none px-6 py-6 border-b sm:px-8 sm:py-6 border-white/10">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl text-white md:text-3xl">{title}</h3>
            <button 
              onclick={onClose}
              class="p-2 transition-colors duration-300 rounded-lg hover:bg-white/10"
            >
              <CrossIcon className="w-6 h-6" fill="white" />
            </button>
          </div>
        </div>
        <div class="flex-1 px-6 py-6 overflow-y-auto sm:px-8 sm:py-6">
          {@render children()}
        </div>
      </div>
    </div>
  </div>
{/if}