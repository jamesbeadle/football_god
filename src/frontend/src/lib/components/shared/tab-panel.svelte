<script lang="ts">

    export let activeTab: string;
    export let setActiveTab: (tabName: string) => void;
    export let tabs: {id: string, label: string}[];
</script>

<ul class="tab-container">
  {#each tabs as tab}
    <li class={`mr-4 ${activeTab === tab.id ? "active-tab" : ""}`}>
      <button
        class={`p-2 ${
          activeTab === tab.id ? "text-white" : "BrandGray"
        }`}
        on:click={() => setActiveTab(tab.id)}>{tab.label}</button
      >
    </li>
  {/each}
</ul>