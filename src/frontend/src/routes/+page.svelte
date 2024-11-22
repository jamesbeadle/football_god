<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { authStore, type AuthSignInParams } from "$lib/stores/auth-store";
  import Layout from "./Layout.svelte";
  import FootballIcon from "$lib/icons/FootballIcon.svelte";
    import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  
  let isLoggedIn = false;
  let isLoading = true;

  type TileData = {
    title: string;
    content: string;
    link: string;
    image?: string;
    icon?: any;
    buttonText: string;
  };

  let interval: NodeJS.Timeout;

  onMount(async () => {
    try {
      await authStore.sync();

      authStore.subscribe((store) => {
        isLoggedIn = store.identity !== null && store.identity !== undefined;
      });
      
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  let tiles: TileData[] = [
    {
      title: "OpenFPL",
      content:
        "Decentralised Premier League fantasy football.",
      link: "https://openfpl.xyz",
      image: "fpl.jpg",
      buttonText: "Play",
    },
    {
      title: "OpenWSL",
      content:
        "Decentralised Women's Super League fantasy football.",
      link: "https://openwsl.xyz",
      image: "wsl.jpg",
      buttonText: "Play",
    },
    {
      title: "Transfer Kings",
      content:
        "Get your unique 'Transfer Kings' agent name today.",
      link: "https://transferkings.xyz",
      image: "transferkings.png",
      buttonText: "Rules",
    },
  ];

  function handleLogin() {
    let params: AuthSignInParams = {
      domain: import.meta.env.VITE_AUTH_PROVIDER_URL,
    };
    authStore.signIn(params);
  }
</script>

<Layout>
  {#if isLoading}
    <FullScreenSpinner />
  {:else}
    <div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg">
      <div
        class="bg-cover bg-center bg-no-repeat py-20 px-4"
        style="background-image: url('banner.jpg');"
      >
        <div class="container ml-4 flex flex-col justify-between">
          <p class="text-xl md:text-4xl font-bold">FootballGod</p>
          <p class="text-sm md:text-base">Decentralised Football Gaming</p>
         
          <div
            class="overlay-panel h-10 rounded-tl-lg w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/4 bg-DARK flex items-center px-1 md:px-4 text-xs md:text-sm"
          >
            <FootballIcon className="w-6 mr-2" />
            <p class="text-white  font-bold">Football Betting coming 2025</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mr-2 py-2">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each tiles as tile}
          <div class="bg-gray-700 rounded-lg overflow-hidden flex flex-col">
            {#if tile.image}
              <img
                class="w-full h-48 object-cover"
                src={tile.image}
                alt={tile.title}
              />
            {/if}
            {#if tile.icon}
              <div class="flex items-center justify-center h-48 bg-gray-800">
                <svelte:component this={tile.icon} className="h-32 w-32" />
              </div>
            {/if}
            <div class="flex flex-col justify-between flex-grow p-4">
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-white">{tile.title}</h3>
                <p class="mt-2 text-white">{tile.content}</p>
              </div>
              <div class="mt-4 flex justify-end">
                <a
                  href={tile.link}
                  class="bg-black text-white px-4 py-2 rounded"
                  target={tile.link.startsWith("http") ? "_blank" : "_self"}
                  rel={tile.link.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {tile.buttonText}
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
  {/if}
</Layout>