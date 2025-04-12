<script lang="ts">
    import LogoIcon from "$lib/icons/LogoIcon.svelte";

    export let toggleMenu: () => void;

</script>

<header class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-16 px-4 text-white shadow-md bg-BrandGray/90">
  <a 
    href="/" 
    class="flex items-center space-x-2 transition-transform hover:scale-105"
  >
    <LogoIcon className="w-10 h-10" />
    <span class="hidden text-xl text-white cta-text sm:block">Football God</span>
  </a>

  <div class="flex items-center gap-4">
    <button
      on:click={toggleMenu}
      class="fixed z-50 p-2 text-white transition-colors rounded-md bg-BrandBlueComp top-4 right-4 hover:bg-BrandBlue"
      aria-label="Toggle menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</header>