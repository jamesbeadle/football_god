<script lang="ts">
    import LandingPageDisplay from "./landing-page-display.svelte";  
</script>

<svelte:head>
    <link rel="preload" href="/background.jpg" as="image" />
</svelte:head>

<div class="flex flex-col w-full h-screen space-y-4 md:bg-BrandGray md:p-3 md:flex-row">
    <div class="relative flex flex-col w-full h-full bg-center bg-cover md:rounded-lg md:w-1/2" style="background-image: url('background.jpg')">
        <div class="items-end h-full p-4 md:flex bg-gradient-to-t from-black/70 to-transparent md:rounded-lg">
            <h1 class="hidden w-full text-2xl font-bold text-center lg:text-3xl md:block md:pb-8 lg:pb-0">
                A Fully Decentralised Dataset Owned By The Fans
            </h1>
            <div class="flex items-center justify-center min-h-[55%] mx-4 my-24 py-16 px-4 rounded-lg bg-BrandGray md:hidden">
                <LandingPageDisplay/>
            </div>
    
            <div class="pt-4 pb-6 md:hidden">
                <h2 class="mx-4 text-2xl text-center xxs:pb-8 text-bold md:hidden">
                    A Fully Decentralised Dataset Owned By The Fans
                </h2>
            </div>
        </div>
    </div>
    <div class="items-center justify-center hidden w-1/2 h-full md:flex">
        <LandingPageDisplay />
    </div>
</div>
