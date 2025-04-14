<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>
<div class="h-full content-panel !border-2 !border-BrandPurple/50 !rounded-lg">
    {@render children()}
</div>