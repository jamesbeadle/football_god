<script lang="ts">
    import LoadingDots from "../../shared/loading-dots.svelte";

    export let header: string;
    export let content: string;
    export let footer: string;
    export let loading: boolean;
</script>

<div class="flex-grow">
    <p class="text-center content-panel-header">{header}</p>
    <p class="text-center content-panel-stat">

        {#if loading}
            <LoadingDots />
        {:else}
            {content}
        {/if}
    </p>
    <p class="text-center content-panel-header">
      {footer}
    </p>
</div>