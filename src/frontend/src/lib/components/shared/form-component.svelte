<script lang="ts">
    export let label: string;
</script>
<div class="flex-col">
    <p class="block mb-1 text-sm text-gray-400">{label}</p>
    <slot></slot>
</div>