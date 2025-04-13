<script lang="ts">
  import { signOut } from "$lib/services/auth.services";
  import { goto } from "$app/navigation";
  import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
  import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
  import DataIcon from "$lib/icons/side-nav/data-icon.svelte";
  import { page } from "$app/stores";
  import LogoutIcon from "$lib/icons/LogoutIcon.svelte";
  import LogoIcon from "$lib/icons/LogoIcon.svelte";
  import ProfileIcon from "$lib/icons/ProfileIcon.svelte";
  import FanIcon from "$lib/icons/side-nav/fan-icon.svelte";
  import MenuIcon from "$lib/icons/MenuIcon.svelte";
  import { fade } from "svelte/transition";

  interface Props {
    isMenuOpen: boolean;
    toggleMenu: () => void;
  }
  let { isMenuOpen, toggleMenu }: Props = $props();

  const menuItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: FanIcon, label: "Fan Zone", path: "/fan-zone" },
    { icon: DataIcon, label: "Data", path: "/data" },
    { icon: GovernanceIcon, label: "Governance", path: "/governance" },
    { icon: ProfileIcon, label: "Profile", path: "/profile" },
    { icon: LogoutIcon, label: "Sign Out", path: "/" },
  ];

  async function handleMenuItemClick(item: (typeof menuItems)[number]) {
    if (item.label === "Sign Out") {
      await signOut();
      await goto("/", { replaceState: true });
      toggleMenu();
      return;
    }
    await goto(item.path);
    toggleMenu();
  }

  // Handle outside clicks
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest(".sidebar-content") &&
      !target.closest("[aria-label='Toggle menu']") &&
      isMenuOpen
    ) {
      toggleMenu();
    }
  }


</script>

<svelte:body on:click={handleOutsideClick} />

{#if isMenuOpen}
  <!-- Overlay for outside clicks -->
  <div
    class="fixed inset-0 z-30 bg-black/50"
    transition:fade={{ duration: 300 }}
  ></div>
{/if}

<div
  class="{isMenuOpen ? 'translate-x-0' : 'translate-x-full'} fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-BrandGray shadow-xl transform transition-transform duration-300 ease-in-out sidebar-content"
>
  <button
    onclick={toggleMenu}
    class="absolute top-4 right-4 p-2 text-BrandGrayShade4 hover:text-BrandBlue hover:scale-110 transition-all duration-200"
    aria-label="Close sidebar"
  >
    <MenuIcon className="w-6 h-6" fill="white" />
  </button>

  <nav class="h-full px-6 pt-16 bg-BrandBlueComp text-white text-lg">
    <div class="flex items-center my-4 p-2">
      <LogoIcon className="w-6 mr-2" fill="white" />
      <p>Football God</p>
    </div>
    <ul class="space-y-4">
      {#each menuItems as item}
        <li>
          <button
            onclick={() => handleMenuItemClick(item)}
            class="flex items-center w-full p-2 space-x-4 text-white hover:bg-BrandGray rounded transition-colors"
            class:active={$page.url.pathname === item.path}
          >
            <item.icon
              className="w-6 h-6"
              fill={$page.url.pathname === item.path ? '#FFFFFF' : '#9CA3AF'}
            />
            <span
              class={$page.url.pathname === item.path
                ? 'text-white'
                : 'text-zinc-400'}
            >
              {item.label}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .active {
    @apply bg-BrandGray/50;
  }

  .translate-x-0 {
    transform: translateX(0) !important;
  }

  .translate-x-full {
    transform: translateX(100%) !important;
  }
</style>