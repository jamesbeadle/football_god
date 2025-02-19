<script lang="ts">
    import type { Writable } from "svelte/store";
    import DropdownSelect from "../dropdown-select.svelte";

    export let selectedFixtureType: Writable<number>;

    const options = [
        { id: -1, label: "All Fixtures" },
        { id: 0, label: "Home" },
        { id: 1, label: "Away" }
    ];
</script>
<div class="flex px-4 py-2 border-b border-gray-700">
  <div class="flex items-center w-full">
      <DropdownSelect
          value={$selectedFixtureType}
          options={options}
          onChange={(value) => selectedFixtureType.set(Number(value))}
      />
  </div>
</div>