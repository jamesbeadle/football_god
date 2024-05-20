<script lang="ts">
  import Vision from "$lib/components/lightpaper/vision.svelte";
  import Layout from "../Layout.svelte";
  let activeTab: string = "vision";

  function setActiveTab(tab: string): void {
    activeTab = tab;
  }
</script>

<Layout>
  <div class="bg-panel mt-4">
    <h1 class="p-4 mx-1 default-header">FootballGod Lightpaper</h1>
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
    </ul>

    {#if activeTab === "vision"}
      <Vision />
    {/if}
  </div>
</Layout>
