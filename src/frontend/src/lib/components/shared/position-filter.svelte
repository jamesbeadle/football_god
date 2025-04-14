<script lang="ts">
    import { getPositionIndexToText, Position } from "$lib/utils/helpers";
    import type { Writable } from "svelte/store";
    import FormComponent from "./form-component.svelte";
    
    interface Props {
        selectedPosition: Writable<number>;
    }
    let { selectedPosition }: Props = $props();

    let positionValues: number[] = Object.values(Position).filter(
        (value) => typeof value === "number"
    ) as number[];

    const options = [
        { id: -1, label: "All Positions" },
        ...positionValues.map((position) => ({ 
            id: position, 
            label: getPositionIndexToText(position) 
        }))
    ];
</script>

<div class="flex px-4 py-2 border border-gray-700">
    <div class="flex items-center w-full">
        <FormComponent label="Select Gameweek">
          <select class="brand-dropdown" bind:value={selectedPosition}>
            {#each options as position}
              <option value={position.id}>{position.label}</option>
            {/each}
          </select>
        </FormComponent>
    </div>
</div>