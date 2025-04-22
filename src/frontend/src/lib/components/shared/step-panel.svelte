<script lang="ts">
    import ArrowDown from "$lib/icons/ArrowDown.svelte";

    interface Props {
        step: number;
        title: string;
        description: string;
    }
    let { step, title, description }: Props = $props();

    let isExpanded = $state(false);

    function toggleExpansion() {
        isExpanded = !isExpanded;
    }

    function formatDescription(text: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" class="text-BrandBlue hover:underline">$1</a>');
    }
</script>

<div class="transition-all duration-300 {isExpanded ? 'bg-white/5' : 'bg-BrandGray/20'} rounded-md">
    <button
        type="button"
        class="flex items-center justify-between w-full p-4 text-left transition-colors duration-300 rounded-md hover:bg-white/5"
        onclick={toggleExpansion}
    >
        <div class="flex gap-3">
            <span class="text-base font-bold text-white md:text-lg">
                {step}.
            </span>
            <p class="text-base font-semibold text-white md:text-lg">{title}</p>
        </div>
        <div class="transition-transform duration-300 {isExpanded ? 'rotate-180' : ''}">
            <ArrowDown fill="white" className="w-5 h-5" />
        </div>
    </button>
    <div class="overflow-hidden transition-[max-height] duration-300 ease-in-out" style="max-height: {isExpanded ? '200px' : '0px'}">
        <div class="px-4 pt-2 pb-4">
            <p class="text-sm text-white/80 md:text-base">
                {@html formatDescription(description)}
            </p>
        </div>
    </div>
</div>