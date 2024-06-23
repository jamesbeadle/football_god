<script lang="ts">
  import Layout from "../Layout.svelte";
  import BlackLogoIcon from "$lib/icons/LogoIcon.svelte";
  
  import Vision from "$lib/components/whitepaper/vision.svelte";
  import Product from "$lib/components/whitepaper/product.svelte";
  import DAO from "$lib/components/whitepaper/dao.svelte";
  import Marketing from "$lib/components/whitepaper/marketing.svelte";
  import RoadMap from "$lib/components/whitepaper/roadmap.svelte";
  import Team from "$lib/components/whitepaper/team.svelte";
  import SystemArchitecture from "$lib/components/whitepaper/system-architecture.svelte";

  let activeTab = "vision";

  const tabs = [
    { name: "Vision", component: Vision },
    { name: "Product", component: Product },
    { name: "DAO", component: DAO },
    { name: "Marketing", component: Marketing },
    { name: "Road Map", component: RoadMap },
    { name: "Team", component: Team },
    { name: "System Architecture", component: SystemArchitecture },
  ];

  function nextTab(): void {
    const currentIndex = tabs.findIndex(tab => tab.name.toLowerCase() === activeTab);
    if (currentIndex < tabs.length - 1) {
      activeTab = tabs[currentIndex + 1].name.toLowerCase();
    }
  }

  function prevTab(): void {
    const currentIndex = tabs.findIndex(tab => tab.name.toLowerCase() === activeTab);
    if (currentIndex > 0) {
      activeTab = tabs[currentIndex - 1].name.toLowerCase();
    }
  }

  function isActiveTab(index: number): boolean {
    return tabs[index].name.toLowerCase() === activeTab;
  }
</script>

<Layout>
  <div class="p-2 mt-8">
    <div class="flex flex-col bg-OPENFPLPURPLE rounded-md rounded-b-lg xs:text-lg sm:text-xl">
      <div class="flex flex-row items-center px-4 border-b border-b-OPENFPLPURPLE justify-between">
        <div class="flex items-center">
          <BlackLogoIcon className="w-4 xs:w-6 sm:w-8 mx-1 xs:mx-2 sm:mx-3 my-2" />
          <p class="p-2 xs:p-3 sm:p-4">FootballGod Whitepaper</p>
        </div>
      </div>

      <div class="w-full bg-OPENFPL p-4 rounded-b-md flex flex-col text-sm xs:text-base sm:text-lg text-black">
        
        {#each tabs as { name, component }}
          {#if activeTab === name.toLowerCase()}
            <div class="flex flex-col">

              <div class="flex flex-col sm:hidden text-xs">
                <div class="flex flex-row">
                  <button
                    class="w-1/2 py-2 px-4 rounded-l bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={prevTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === 0}
                  >
                    Prior Section
                  </button>
                  <button
                    class="w-1/2 py-2 px-4 rounded-r bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={nextTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === tabs.length - 1}
                  >
                    Next Section
                  </button>
                </div>
                <div class="flex flex-row justify-center my-4">
                  {#each tabs as _, index}
                    <div class="pip" class:is-active={isActiveTab(index)}></div>
                  {/each}
                </div>

              </div>

              <div class="hidden sm:flex flex-col text-xs  mb-4">
                <div class="flex flex-row items-center justify-between">
                  <button
                    class="py-2 px-4 rounded flex-grow bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={prevTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === 0}
                  >
                    Prior Section
                  </button>
                  <div class="flex-grow flex flex-row justify-center">
                    {#each tabs as _, index}
                      <div class="pip" class:is-active={isActiveTab(index)}></div>
                    {/each}
                  </div>
                  <button
                    class="py-2 px-4 rounded flex-grow bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={nextTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === tabs.length - 1}
                  >
                    Next Section
                  </button>
                </div>
              </div>
              

              <div class="horizontal-divider" />
              <div class="flex my-4">
                <svelte:component this={component} />
              </div>
              <div class="horizontal-divider" />

              <div class="flex flex-col sm:hidden">
                <div class="flex flex-row justify-center my-4">
                  {#each tabs as _, index}
                    <div class="pip" class:is-active={isActiveTab(index)}></div>
                  {/each}
                </div>
                
                
                <div class="flex flex-col sm:hidden text-xs">
                  <div class="flex flex-row">
                    <button
                      class="w-1/2 py-2 px-4 rounded-l bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                      on:click={prevTab}
                      disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === 0}
                    >
                      Prior Section
                    </button>
                    <button
                      class="w-1/2 py-2 px-4 rounded-r bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                      on:click={nextTab}
                      disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === tabs.length - 1}
                    >
                      Next Section
                    </button>
                  </div>
  
                </div>
                
              </div>


              <div class="hidden sm:flex flex-col text-xs  mt-4">
                <div class="flex flex-row items-center justify-between">
                  <button
                    class="text-white py-2 px-4 rounded flex-grow bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={prevTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === 0}
                  >
                    Prior Section
                  </button>
                  <div class="flex-grow flex flex-row justify-center">
                    {#each tabs as _, index}
                      <div class="pip" class:is-active={isActiveTab(index)}></div>
                    {/each}
                  </div>
                  <button
                    class="py-2 px-4 rounded flex-grow bg-GRAY text-white disabled:bg-LIGHT disabled:text-gray-400"
                    on:click={nextTab}
                    disabled={tabs.findIndex(tab => tab.name.toLowerCase() === activeTab) === tabs.length - 1}
                  >
                    Next Section
                  </button>
                </div>
              </div>



            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</Layout>

<style>
  .pip {
    width: 10px;
    height: 10px;
    background-color: gray;
    border-radius: 50%;
    margin: 0 2px;
  }
  
  .pip.is-active {
    @apply bg-DARK
  }

  @media (min-width: 640px) {
    .pip {
      width: 12px;
      height: 12px;
    }
  }
</style>
