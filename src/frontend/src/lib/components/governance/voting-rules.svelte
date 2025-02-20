<script lang="ts">
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  
  export let minimumYesExercised: number;
  export let minimumYesTotal: number;
  
  let showRules = false;
</script>

<div class="mt-2 text-gray-400">
  <button 
    class="flex items-center justify-between w-full gap-2 text-xl transition-colors hover:text-white"
    on:click={() => showRules = !showRules}
  >
    <span>Voting Rules</span>
    {#if showRules}
      <ArrowUp className="w-6 h-6" />
    {:else}
      <ArrowDown className="w-6 h-6" />
    {/if}
  </button>
  
  {#if showRules}
    <div class="mt-4 space-y-4 transition-all">
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span>1.</span>
          <span>Immediate majority decision</span>
        </div>
        <p class="pl-6">
          A proposal is immediately adopted or rejected if, before the voting period ends, 
          more than {minimumYesExercised/100}% of the total voting power votes Yes, or at least {minimumYesExercised/100}% votes No, 
          respectively (indicated by the purple line).
        </p>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span>2.</span>
          <span>Standard majority decision</span>
        </div>
        <p class="pl-6">
          At the end of the voting period, a proposal is adopted if more than half of the votes cast are Yes votes, 
          provided these votes represent at least {minimumYesTotal/100}% of the total voting power 
          (indicated by the yellow line). 
          Otherwise, it is rejected. Before a proposal is decided, the voting period can be extended in order to "wait for quiet". 
          Such voting period extensions occur when a proposal's voting results turn from either a Yes majority to a No majority or vice versa.
        </p>
      </div>
    </div>
  {/if}
</div> 