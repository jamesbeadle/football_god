<script lang="ts">
    import IcpLogo from "$lib/icons/IcpLogo.svelte";
    import LogoIcon from "$lib/icons/LogoIcon.svelte";
    import { signIn } from "$lib/services/auth.services";
</script>

<div class="relative flex flex-col items-center justify-center w-full md:min-h-screen">
    <div class="items-center w-full max-w-sm mx-4">
        <div class="flex flex-col items-center justify-center mb-5">
            <LogoIcon fill='white' className="mx-auto mb-4 w-24 h-24" />
            <h2 class="text-2xl text-center">FOOTBALL GOD</h2>
        </div>
        <p class="mb-8 text-center text-BrandGrayShade6">
            Football data, owned by the fans.
        </p>
        <div class="flex flex-row items-center justify-center mx-2 mb-4 space-x-2 md:space-x-4">
            <div class="w-full border border-l border-BrandGrayShade1"></div>
            <p class="text-center text-xxs whitespace-nowrap">Connect Instantly</p>
            <div class="w-full border border-r border-BrandGrayShade1"></div>
        </div>
        <div class="mx-2 space-y-4">

            <button 
                class="brand-button w-full"
                onclick={async () => await signIn({})}
            >
                <span class="flex flex-row items-center justify-center space-x-2">
                    <IcpLogo className='w-6' />
                    <span>Internet Identity</span>
                </span> 
            </button>
        </div>
    </div>
</div>