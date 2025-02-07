<script lang="ts">
    export let label: string;
</script>
<div class="flex-col">
    <p class="text-xs mb-2">{label}</p>
    <slot></slot>
</div>