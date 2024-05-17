<script lang="ts">
  import Architecture from "$lib/components/whitepaper/architecture.svelte";
  import Roadmap from "$lib/components/whitepaper/roadmap.svelte";
  import Tokenomics from "$lib/components/whitepaper/tokenomics.svelte";
  import Vision from "$lib/components/whitepaper/vision.svelte";
  import Layout from "../Layout.svelte";
  let activeTab: string = "vision";

  function setActiveTab(tab: string): void {
    activeTab = tab;
  }
</script>

<Layout>
  <div class="bg-panel mt-4">
    <h1 class="p-4 mx-1 default-header">FootballGod Whitepaper</h1>
    <ul
      class="flex flex-nowrap overflow-x-auto bg-light-gray border-b border-gray-700 px-4 pt-2"
    >
      <li class={`mr-4 ${activeTab === "vision" ? "active-tab" : ""}`}>
        <button
          class={`p-2 ${
            activeTab === "vision" ? "text-white" : "text-gray-400"
          }`}
          on:click={() => setActiveTab("vision")}
        >
          Vision
        </button>
      </li>
      <li class={`mr-4 ${activeTab === "tokenomics" ? "active-tab" : ""}`}>
        <button
          class={`p-2 ${
            activeTab === "tokenomics" ? "text-white" : "text-gray-400"
          }`}
          on:click={() => setActiveTab("tokenomics")}
        >
          Tokenomics
        </button>
      </li>
      <li class={`mr-4 ${activeTab === "architecture" ? "active-tab" : ""}`}>
        <button
          class={`p-2 ${
            activeTab === "architecture" ? "text-white" : "text-gray-400"
          }`}
          on:click={() => setActiveTab("architecture")}
        >
          Architecture
        </button>
      </li>
      <li class={`mr-4 ${activeTab === "roa map" ? "active-tab" : ""}`}>
        <button
          class={`p-2 ${
            activeTab === "roadmap" ? "text-white" : "text-gray-400"
          }`}
          on:click={() => setActiveTab("roadmap")}
        >
          Roadmap
        </button>
      </li>
    </ul>

    {#if activeTab === "vision"}
      <Vision />
    {:else if activeTab === "roadmap"}
      <Roadmap />
    {:else if activeTab === "tokenomics"}
      <Tokenomics />
    {:else if activeTab === "architecture"}
      <Architecture />
    {/if}
  </div>
</Layout>
