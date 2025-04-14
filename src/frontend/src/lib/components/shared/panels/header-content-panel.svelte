<script lang="ts">
    import LoadingDots from "../../shared/loading-dots.svelte";
    
    interface Props {
        header: string;
        content: string;
        footer: string;
        loading: boolean;
    }
    let { header, content, footer, loading }: Props = $props();
    
</script>

<div class="flex">
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