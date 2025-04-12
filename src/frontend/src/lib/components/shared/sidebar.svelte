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

  interface Props {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    isSaleOnly: boolean;
  }
  let { isMenuOpen, toggleMenu, isSaleOnly }: Props = $props();
  
  let menuRef: HTMLDivElement;

  async function handleDisconnect(){
    await signOut();
    goto('/', { replaceState: true });
  }

  const menuItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: FanIcon, label: "Fan Zone", path: "/fan-zone" },
    { icon: DataIcon, label: "Data", path: "/data" },
    { icon: GovernanceIcon, label: "Governance", path: "/governance" },
    { icon: ProfileIcon, label: "Profile", path: "/profile" },
    { icon: LogoutIcon, label: "Sign Out", path: "/" }
  ];

  async function selectMenuItem(item: any) {
    if(item.label == "Sign Out"){
      handleDisconnect();
      return;
    }

    goto(item.path);
  }
</script>
<div 
  class="{isMenuOpen ? 'translate-x-0' : 'translate-x-full'} fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-BrandGray/90 shadow-xl transform transition-transform duration-300 ease-in-out"
  bind:this={menuRef}
>

  <button
    onclick={toggleMenu}
    class="absolute p-2 transition-all duration-200 text-BrandGrayShade4 top-4 right-4 hover:text-BrandBlue hover:scale-110"
    aria-label="Close sidebar"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <nav class="h-full px-6 pt-16 text-lg text-white bg-BrandBlueComp cta-text">
    <div class="flex flex-row items-center my-4 p-2">
      <LogoIcon className="w-6 mr-2" />
      <p>Football God</p>
    </div>
    <ul class="space-y-4">
      {#each menuItems as item}
        <li>
          <a
            href={item.path}
            class="flex items-center p-2 space-x-4 text-white transition-colors rounded hover:bg-BrandGray"
              onclick={() => selectMenuItem(item)}
          >
              <item.icon className="w-6 h-6" fill={$page.url.pathname === item.path ? '#FFFFFF' : '#9CA3AF'} />
              <span class={$page.url.pathname === item.path ? 'text-white' : 'text-zinc-400'}>
                  {item.label}
              </span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>