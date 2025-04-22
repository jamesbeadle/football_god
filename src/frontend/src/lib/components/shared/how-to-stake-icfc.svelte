<script lang="ts">
    import CopyPrincipal from '../profile/copy-principal.svelte';
    import StepPanel from './step-panel.svelte';


    interface Props {
        getUserNeurons: () => Promise<void>;
    }
    let { getUserNeurons }: Props = $props();
    let steps = [
        {
            step: 1,
            title: "Log into NNS",
            description: "Go to https://nns.ic0.app/ and log in with your internet identity."
        },
        {
            step: 2,
            title: "Stake ICFC",
            description: "Click on 'Neuron Staking' in the left sidebar, then find and click on ICFC in the list of nervous systems. Now click the 'Stake ICFC' button. Enter the amount of ICFC you want to stake and set the max dissolve delay to qualify for a ICFC membership."
        },
        {
            step: 3,
            title: "Add Hot Key",
            description: "Once your have staked ICFC, you will see that a neuron is created. Click on your neuron and scroll down to the 'Hot Key' section. Click on the 'Add Hot Key' button and enter your principal ID from the ICFC profile page. Then click 'Confirm' to add your hot key."
        },
        {
            step: 4,
            title: "Refresh Page",
            description: "Once your hot key is added, refresh the page to see your newly added ICFC neuron in the list of neurons."
        }
    ]

    async function refreshNeurons() : Promise<void> {
        getUserNeurons();
    }
</script>

<div class="flex flex-col w-full h-full max-w-2xl mx-auto">

    <div class="p-6 border-b border-white/10">
        <div class="flex items-center justify-between">
            <h3 class="text-2xl text-white cta-text md:text-3xl">Welcome to Football God</h3>
        </div>
        <p class="mt-1 text-sm text-white/60 md:text-base">Stake ICFC by following the instructions below to participate in ICFC football governance.</p>
    </div>

    <div class="p-6 border-b border-white/10">
        <div class="flex items-center justify-between">
            <h3 class="text-2xl text-white cta-text md:text-3xl">Your Principal ID</h3>
        </div>
        <div class="mt-1 text-white/60">
            <CopyPrincipal backgroundColour='BrandDarkGray' borderColor='white' />
        </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
        <div class="flex flex-col space-y-4">
            {#each steps as step}
                <StepPanel {...step} />
            {/each}
        </div>
    </div>

    <button onclick={refreshNeurons} class="brand-button">Refresh</button>
</div>