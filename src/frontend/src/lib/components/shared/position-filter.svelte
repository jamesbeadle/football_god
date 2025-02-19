<script lang="ts">
    import { getPositionIndexToText, Position } from "$lib/utils/helpers";
    import type { Writable } from "svelte/store";
    import DropdownSelect from "./dropdown-select.svelte";

    export let selectedPosition: Writable<number>;

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
        <DropdownSelect
            value={$selectedPosition}
            options={options}
            onChange={(value) => selectedPosition.set(Number(value))}
        />
    </div>
</div>