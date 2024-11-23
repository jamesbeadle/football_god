<script lang="ts">
  export let text: string;
  let tooltipVisible = false;

  function toggleTooltip() {
    tooltipVisible = !tooltipVisible;
  }
</script>

<button
  class="relative flex items-center w-6 max-w-6 text-sm"
  on:mouseenter={() => (tooltipVisible = true)}
  on:mouseleave={() => (tooltipVisible = false)}
  on:click={toggleTooltip}
>
  <slot />
  {#if tooltipVisible}
    <button
      class="absolute z-10 p-2 bg-BrandPositive text-white rounded-md shadow-lg p-2 px-4 hidden md:flex bg-opacity-75"
      style="transform: translate(20%, -50%); top: 50%; left: 50%;"
      on:click={toggleTooltip}
    >
      {text}
    </button>
  {/if}
</button>
