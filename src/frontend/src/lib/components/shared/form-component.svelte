<script lang="ts">
    export let label: string;
</script>
<div class="flex-col">
    <p class="text-xs">{label}</p>
    <slot></slot>
</div>