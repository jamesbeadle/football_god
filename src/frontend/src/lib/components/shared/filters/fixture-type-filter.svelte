<script lang="ts">
    import type { Writable } from "svelte/store";
    import FormComponent from "../form-component.svelte";
    interface Props {
        selectedFixtureType: Writable<number>;
    }
    let { selectedFixtureType }: Props = $props();

    const options = [
        { id: -1, label: "All Fixtures" },
        { id: 0, label: "Home" },
        { id: 1, label: "Away" }
    ];
</script>
<div class="flex px-4 py-2 border-b border-gray-700">
  <div class="flex items-center w-full">
    <FormComponent label="Select Gameweek">
        <select class="brand-dropdown" bind:value={$selectedFixtureType}>
          {#each options as fixture}
            <option value={fixture.id}>{fixture.label}</option>
          {/each}
        </select>
    </FormComponent>
  </div>
</div>