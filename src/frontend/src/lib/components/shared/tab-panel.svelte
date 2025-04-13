<script lang="ts">

    export let activeTab: string;
    export let setActiveTab: (tabName: string) => void;
    export let tabs: {id: string, label: string}[];
</script>

<ul class="tab-container">
  {#each tabs as tab}
    <li class={`mr-2`}>
      <button
        class={`px-4 py-2 rounded-xl text-white ${
          activeTab === tab.id ? "bg-BrandPurple" : "border-1 border-solid border-BrandDarkGray"
        }`}
        on:click={() => setActiveTab(tab.id)}>{tab.label}</button
      >
    </li>
  {/each}
</ul>