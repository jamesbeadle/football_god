<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        label: string;
        children: Snippet;
    }
    let { label, children }: Props = $props();
</script>
<div class="flex-col">
    <p class="block mb-1 text-sm text-gray-400">{label}</p>
    {@render children()}
</div>