<script lang="ts">
  import ArrowUp from "$lib/icons/ArrowUp.svelte";
  import ArrowDown from "$lib/icons/ArrowDown.svelte";
  import LikeButton from "$lib/icons/LikeButton.svelte";
  import DislikeButton from "$lib/icons/DislikeButton.svelte";
  import type { ProposalData } from "@dfinity/sns/dist/candid/sns_governance";
  
  export let yesVotes: number = 0;
  export let noVotes: number = 0;
  export let totalVotes: number = 100;
  export let proposal: ProposalData;
  export let onVoteYes: () => void;
  export let onVoteNo: () => void;
  export let isExecuted: boolean;

  $: yesPercentage = (yesVotes / totalVotes) * 100;
  $: noPercentage = (noVotes / totalVotes) * 100;
  $: expirationDate = (() => {
    if (isExecuted) {
      return proposal.executed_timestamp_seconds > 0n ? "Proposal Adopted" : "Proposal Rejected";
    }
    const creationTime = Number(proposal.proposal_creation_timestamp_seconds ?? 0n);
    const votingPeriod = Number(proposal.initial_voting_period_seconds ?? 0n);
    const expirationTime = creationTime + votingPeriod;
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = expirationTime - now;
    
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    
    return `${days} days, ${hours} hours remaining`;
  })();
  
  let showRules = false;
</script>
  
<div class="space-y-4">
  <h2 class="text-2xl">Voting Results</h2>
  
  <div class="flex items-center gap-4">
    <div class="flex flex-col items-center gap-1">
      <div class="text-BrandGreen">Adopt</div>
      <button 
        class="p-2 rounded-full transition-colors {isExecuted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-BrandGreen/10'}"
        on:click={onVoteYes}
        disabled={isExecuted}
      >
        <LikeButton className="w-6 h-6" color="#2CE3A6" />
      </button>
      <div class="text-2xl text-BrandGreen">{yesPercentage.toFixed(3)}%</div>
    </div>
    
    <div class="flex-1">
      <div class="relative w-full h-8 overflow-hidden rounded-lg bg-BrandInactive">
        <div class="absolute inset-0 z-20">
          <div class="absolute left-[3%] h-full w-[3px] bg-yellow-400"></div>
          <div class="absolute left-[50%] h-full w-[3px] bg-BrandPurple"></div>
        </div>

        <div class="absolute inset-0 z-10">
          <div class="relative flex h-full">
            <div class="h-full bg-BrandGreen" style="width: {yesPercentage}%"></div>
            <div class="h-full bg-BrandInactive" style="width: {100 - yesPercentage}%"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col items-center gap-1">
      <div class="text-BrandRed">Reject</div>
      <button 
        class="p-2 rounded-full transition-colors {isExecuted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-BrandRed/10'}"
        on:click={onVoteNo}
        disabled={isExecuted}
      >
        <DislikeButton className="w-6 h-6" color="#CF5D43" />
      </button>
      <div class="text-2xl text-BrandRed">{noPercentage.toFixed(3)}%</div>
    </div>
  </div>
  
  <div class="text-center text-gray-400">Expiration date<br/>{expirationDate}</div>
  
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
            more than half of the total voting power votes Yes, or at least half votes No, 
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
            provided these votes represent at least 3% of the total voting power 
            (indicated by the yellow line). 
            Otherwise, it is rejected. Before a proposal is decided, the voting period can be extended in order to "wait for quiet". 
            Such voting period extensions occur when a proposal's voting results turn from either a Yes majority to a No majority or vice versa.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>