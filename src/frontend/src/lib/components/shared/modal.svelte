<script lang="ts">
  import Portal from 'svelte-portal';
	import type { Snippet } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
  import { isBusy } from '$lib/stores/busy-store';
  import { handleKeyPress } from '$lib/utils/keyboard.utils';
  import { onMount, onDestroy } from 'svelte';
  
  interface Props {
    onClose: () => void;
		children: Snippet;
	}

  let { children, onClose}: Props = $props();

  let visible = $state(true);

  const close = () => {
    if ($isBusy) return;
    visible = false;
    onClose(); 
  }

  const onCloseHandler = ($event: MouseEvent | TouchEvent) => {
    $event.stopPropagation();
    close();
  };

  onMount(() => {
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    document.body.style.overflow = '';
  });

</script>

{#if visible}
  <Portal>
    <div
      class="fixed inset-0 z-[calc(var(--z-index)+998)] flex items-center justify-center"
      out:fade
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalContent"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-50 cursor-pointer"
        onclick={onCloseHandler}
        onkeypress={($event) => handleKeyPress({ $event, callback: close })}
        role="button"
        tabindex="-1"
      ></div>
      <div 
        transition:scale={{ delay: 25, duration: 150, easing: quintOut }} 
        class="relative w-full max-w-xl p-6 shadow-xl"
      >
        <div class="relative max-h-screen px-12 py-4 overflow-auto rounded shadow bg-BrandGray">
          {@render children()}
        </div>
      </div>
    </div>
  </Portal>
{/if}