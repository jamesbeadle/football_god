<script lang="ts">
  import LikeButton from "$lib/icons/LikeButton.svelte";
  import DislikeButton from "$lib/icons/DislikeButton.svelte";
  import type { ProposalData } from "@dfinity/sns/dist/candid/sns_governance";

  interface Props {
    yesVotes: number;
    noVotes: number
    totalVotes: number;
    proposal: ProposalData;
    onVoteYes: () => void;
    onVoteNo: () => void;
    isExecuted: boolean;
  }

  let { yesVotes, noVotes, totalVotes, proposal, onVoteYes, onVoteNo, isExecuted }: Props = $props();

  let yesPercentage = $state(0);
  let noPercentage = $state(0);
  let expirationDate = $state("");
  let minimumYesExercised = $state(0);
  let minimumYesTotal = $state(0);

  $effect(() => { yesPercentage = (yesVotes / totalVotes) * 100; })
  $effect(() => { noPercentage = (noVotes / totalVotes) * 100; })
  $effect(() => { 
    if (isExecuted) {
      expirationDate = proposal.executed_timestamp_seconds > 0n ? "Proposal Adopted" : "Proposal Rejected";
    }
    const creationTime = Number(proposal.proposal_creation_timestamp_seconds ?? 0n);
    const votingPeriod = Number(proposal.initial_voting_period_seconds ?? 0n);
    const expirationTime = creationTime + votingPeriod;
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = expirationTime - now;
    
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    
    expirationDate = `${days} days, ${hours} hours remaining`;
  })
  $effect(() => { minimumYesExercised = Number(proposal.minimum_yes_proportion_of_exercised[0]?.basis_points ?? 5000n) })
  $effect(() => { minimumYesTotal = Number(proposal.minimum_yes_proportion_of_total[0]?.basis_points ?? 300n); })
   
</script>
  
<div class="space-y-4">
  <div class="flex items-center gap-4">
    <div class="stacked-col items-center gap-1">
      <div class="text-BrandGreen">Adopt</div>
      <button 
        class="p-2 rounded-full transition-colors {isExecuted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-BrandGreen/10'}"
        onclick={onVoteYes}
        disabled={isExecuted}
      >
        <LikeButton className="w-6 h-6" fill="#2CE3A6" />
      </button>
      <div class="text-BrandGreen">{yesPercentage.toFixed(3)}%</div>
    </div>
    
    <div class="flex-1">
      <div class="relative w-full h-8 overflow-hidden rounded-lg bg-BrandInactive">
        <div class="absolute inset-0 z-20">
          <div class="absolute h-full w-[3px] bg-yellow-400" style="left: {minimumYesTotal/100}%"></div>
          <div class="absolute h-full w-[3px] bg-BrandPurple" style="left: {minimumYesExercised/100}%"></div>
        </div>

        <div class="absolute inset-0 z-10">
          <div class="relative flex h-full">
            {#if yesPercentage >= noPercentage}
              <div class="h-full bg-BrandGreen" style="width: {yesPercentage}%"></div>
              <div class="h-full bg-BrandInactive" style="width: {100 - yesPercentage}%"></div>
            {:else}
              <div class="h-full bg-BrandInactive" style="width: {100 - noPercentage}%"></div>
              <div class="h-full bg-BrandRed" style="width: {noPercentage}%"></div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <div class="stacked-col items-center gap-1">
      <div class="text-BrandRed">Reject</div>
      <button 
        class="p-2 rounded-full transition-colors {isExecuted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-BrandRed/10'}"
        onclick={onVoteNo}
        disabled={isExecuted}
      >
        <DislikeButton className="w-6 h-6" fill="#CF5D43" />
      </button>
      <div class="text-BrandRed">{noPercentage.toFixed(3)}%</div>
    </div>
  </div>
  
  <div class="text-center text-gray-400">Expiration date<br/>{expirationDate}</div>
</div>