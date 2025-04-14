<script lang="ts">

  interface Props {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
    tabs: {id: string, label: string}[];
  }
  let { activeTab, setActiveTab, tabs }: Props = $props();

</script>

<ul class="tab-container">
  {#each tabs as tab}
    <li class={`mr-2`}>
      <button
        class={`px-4 py-2 rounded-xl text-white ${
          activeTab === tab.id ? "bg-BrandPurple" : "border-1 border-solid border-BrandDarkGray"
        }`}
        onclick={() => setActiveTab(tab.id)}>{tab.label}</button
      >
    </li>
  {/each}
</ul>