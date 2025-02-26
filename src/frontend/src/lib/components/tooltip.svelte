<script lang="ts">
  export let text: string;
  let tooltipVisible = false;

  function toggleTooltip() {
    tooltipVisible = !tooltipVisible;
  }
</script>

<button
  class="relative flex items-center w-6 text-sm max-w-6"
  on:mouseenter={() => (tooltipVisible = true)}
  on:mouseleave={() => (tooltipVisible = false)}
  on:click={toggleTooltip}
>
  <slot />
  {#if tooltipVisible}
    <button
      class="absolute z-10 hidden p-2 px-4 text-white bg-opacity-75 rounded-md shadow-lg bg-BrandSuccess md:flex"
      style="transform: translate(20%, -50%); top: 50%; left: 50%;"
      on:click={toggleTooltip}
    >
      {text}
    </button>
  {/if}
</button>
