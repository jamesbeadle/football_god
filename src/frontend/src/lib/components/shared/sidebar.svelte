<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signOut } from "$lib/services/auth.services";
  
  import HomeIcon from "$lib/icons/side-nav/home-icon.svelte";
  import GovernanceIcon from "$lib/icons/side-nav/governance-icon.svelte";
  import DataIcon from "$lib/icons/side-nav/data-icon.svelte";
  import LogoutIcon from "$lib/icons/LogoutIcon.svelte";
  import LogoIcon from "$lib/icons/LogoIcon.svelte";
  import ProfileIcon from "$lib/icons/ProfileIcon.svelte";
  import FanIcon from "$lib/icons/side-nav/fan-icon.svelte";
  import CrossIcon from "$lib/icons/CrossIcon.svelte";

  interface Props {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    showOptions: boolean;
  }
  let { isMenuOpen, toggleMenu, showOptions }: Props = $props();

  const menuItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: FanIcon, label: "Fan Zone", path: "/fan-zone" },
    { icon: DataIcon, label: "Data", path: "/data/players" },
    { icon: GovernanceIcon, label: "Governance", path: "/governance" },
    { icon: ProfileIcon, label: "Profile", path: "/profile" },
  ];

  const signOutItem = { icon: LogoutIcon, label: "Sign Out", path: "/" };

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

<svelte:body onclick={handleOutsideClick} />

{#if isMenuOpen}
  <div
    class="fixed inset-0 z-30 bg-black/50"
    transition:fade={{ duration: 300 }}
  ></div>
{/if}

<div
  class="{isMenuOpen ? 'translate-x-0' : 'translate-x-[calc(100%+0.5rem)] sm:translate-x-[calc(100%+0.5rem)]'} fixed top-0 bottom-0 right-0 z-40 w-[calc(100%-1rem)] sm:w-80 m-2 sm:m-2 bg-BrandWhiteGray rounded-3xl shadow-lg transform transition-transform duration-300 ease-in-out sidebar-content flex flex-col"
>
  <div class="flex justify-between items-center px-6 pt-6">
    <div class="flex items-center">
      <LogoIcon className="w-6 mr-2" fill="#7F56F1" />
      <p class="font-semibold text-gray-800 text-lg">Football God</p>
    </div>
    <button
      onclick={toggleMenu}
      class="p-2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
      aria-label="Close sidebar"
    >
      <CrossIcon className="w-4 h-4" fill="#7F56F1" />
    </button>
  </div>

  <nav class="flex-1 px-6 pt-6 text-gray-800 text-lg">
    <ul class="space-y-2">
      {#if showOptions}
        {#each menuItems as item}
          <li>
            <button
              onclick={() => handleMenuItemClick(item)}
              class="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-gray-100 transition-colors"
              class:active={$page.url.pathname === item.path}
            >
              <item.icon
                className="w-6 h-6"
                fill={$page.url.pathname === item.path ? '#1F2937' : '#6B7280'}
              />
              <span
                class={$page.url.pathname === item.path
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-500'}
              >
                {item.label}
              </span>
            </button>
          </li>
        {/each}
      {/if}
    </ul>
  </nav>

  <div class="px-6 pb-6">
    <button
      onclick={() => handleMenuItemClick(signOutItem)}
      class="brand-button w-full flex items-center justify-center space-x-4 p-3 rounded-lg"
    >
      <signOutItem.icon className="w-6 h-6" fill="white" />
      <span>{signOutItem.label}</span>
    </button>
  </div>
</div>

<style>
  .active {
    @apply bg-BrandLightGray;
  }

  .translate-x-0 {
    transform: translateX(0) !important;
  }

  .translate-x-\[calc\(100\%\+0\.5rem\)\] {
    transform: translateX(calc(100% + 0.5rem)) !important;
  }

</style>