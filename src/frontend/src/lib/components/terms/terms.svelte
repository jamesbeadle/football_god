<script lang="ts">
    import { userStore } from "$lib/stores/user-store";
    import FullScreenSpinner from "../shared/full-screen-spinner.svelte";

    export let agreeTermsSaving: Boolean = false;

    async function agreeTerms() {
        agreeTermsSaving = true;
        try{
            await userStore.agreeTerms();
        } catch (error){
            console.error("Error agreeing terms", error)
        } finally {
            agreeTermsSaving = false;
        }
    }
</script>
{#if agreeTermsSaving}
  <FullScreenSpinner />
{:else}
  <div class="container mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <p class="text-sm mb-6">
        <strong>Last Updated:</strong> 2nd January 2025
      </p>
    
      <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
      <p class="mb-4">
        Welcome to <strong>FootballGod</strong> (hereinafter referred to as the "Site"). The Site is operated by 
        <strong>Waterway Labs Ltd</strong> ("we," "us," or "our"). By accessing or using our Site or any associated 
        services, you ("the User") agree to be bound by these Terms and Conditions ("T&amp;Cs"). If you do not 
        agree to these T&amp;Cs, do not use the site.
      </p>
      <p class="mb-4">
        <strong>Company Name:</strong> Waterway Labs Ltd<br>
        <strong>Contact Email:</strong> 
        <a href="mailto:support@waterwaylabs.xyz" class="text-blue-600 hover:text-blue-800">
          support@waterwaylabs.xyz
        </a>
      </p>
    
      <h2 class="text-2xl font-semibold mb-4">2. Eligibility</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Legal Age:</strong> You must be of legal age to gamble in your jurisdiction.
        </li>
        <li>
          <strong>Legal Compliance:</strong> You are solely responsible for ensuring that online gambling is 
          legal in your jurisdiction and that you comply with all applicable laws.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">3. Nature of Services</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Gambling Activities:</strong> We offer gambling opportunities where Users can place bets 
          on events or outcomes (the “Games”).
        </li>
        <li>
          <strong>DAO Determination:</strong> Outcomes are determined by a vote of the Decentralised 
          Autonomous Organisation (“DAO”), <em>not</em> necessarily by real-world verified results. The DAO’s 
          final vote is conclusive and binding.
        </li>
        <li>
          <strong>No Real-World Guarantee:</strong> We do not guarantee that the DAO’s determination will match 
          any factual outcome of a real-world event. Payouts are strictly based on the DAO vote.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">4. User Account</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Account Creation:</strong> To participate, you may be required to create an account. You 
          agree to provide accurate information and keep it updated.
        </li>
        <li>
          <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your 
          login credentials. Any activity or transaction under your account will be your sole responsibility.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">5. Placing Bets</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Bet Placement:</strong> When you place a bet, you agree to the staking requirements, potential 
          winnings, and other details displayed on the Site.
        </li>
        <li>
          <strong>Transaction Irreversibility:</strong> Once a bet is confirmed on the blockchain or through 
          our platform, it cannot be reversed.
        </li>
        <li>
          <strong>DAO-Driven Outcome:</strong> The final settlement is determined by a DAO vote. Your acceptance 
          of these T&amp;Cs means you accept the DAO’s decision as final, even if it conflicts with verifiable 
          real-world facts.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">6. Payouts</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Final Settlement:</strong> Payouts are made according to the DAO vote outcome.
        </li>
        <li>
          <strong>No Guarantee:</strong> We are not liable for any discrepancy between the DAO’s declared result 
          and real-world events.
        </li>
        <li>
          <strong>Payment and Fees:</strong> We reserve the right to require you to cover any transaction fees, 
          including network gas fees, when withdrawing winnings.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Fraud &amp; Cheating:</strong> Any attempt to manipulate or cheat will result in account 
          suspension or termination, and potential forfeiture of funds.
        </li>
        <li>
          <strong>Illegal Conduct:</strong> You agree not to use our services for any illegal activities 
          (e.g., money laundering or funding unlawful activities).
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Site Content:</strong> All text, graphics, logos, and software are the property of FootballGod 
          or Waterway Labs Ltd unless otherwise stated.
        </li>
        <li>
          <strong>Limited License:</strong> You are granted a limited, non-exclusive, non-transferable license 
          to access and use the Site for personal, non-commercial purposes.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">9. Reservation of Rights</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Modification of Service:</strong> We reserve the right to modify, suspend, or discontinue any 
          aspect of the Site or services at any time without prior notice.
        </li>
        <li>
          <strong>Changes to T&amp;Cs:</strong> We reserve the right to update or change these T&amp;Cs at any 
          time. Continued use of the Site after updates constitutes acceptance of the modified T&amp;Cs.
        </li>
        <li>
          <strong>All Rights Reserved:</strong> Nothing in these T&amp;Cs grants you any rights beyond those 
          expressly stated.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>No Warranty:</strong> We provide the Site and services “as is” and make no warranties, 
          guarantees, or representations about the availability, accuracy, or reliability of the Site or any 
          content.
        </li>
        <li>
          <strong>Indemnification:</strong> You agree to indemnify and hold us (and our affiliates, officers, 
          directors, employees) harmless from any claims arising from your use of the Site.
        </li>
        <li>
          <strong>No Liability for DAO Outcomes:</strong> We disclaim all liability for any losses or damages 
          arising from the DAO’s voting determinations or any discrepancy with real-world facts.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">11. Governing Law &amp; Dispute Resolution</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Governing Law:</strong> These T&amp;Cs shall be governed by the laws of [Your Jurisdiction], 
          without regard to conflict-of-law principles.
        </li>
        <li>
          <strong>Dispute Resolution:</strong> In the event of any dispute, you agree to first seek an informal 
          resolution by contacting us at 
          <a href="mailto:support@waterwaylabs.xyz" class="text-blue-600 hover:text-blue-800">
            support@waterwaylabs.xyz
          </a>. If unresolved, disputes shall be settled by binding arbitration or in the competent courts of 
          [Your Jurisdiction], as determined by us.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">12. Termination</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Immediate Termination:</strong> We reserve the right to suspend or terminate your account at 
          our discretion for any or no reason, including violation of these T&amp;Cs.
        </li>
        <li>
          <strong>Effect of Termination:</strong> Upon termination, you may forfeit any winnings or funds if we 
          determine that you have breached these T&amp;Cs or engaged in prohibited activities.
        </li>
      </ol>
    
      <h2 class="text-2xl font-semibold mb-4">13. Miscellaneous</h2>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>
          <strong>Severability:</strong> If any provision of these T&amp;Cs is held invalid, the remaining 
          provisions remain in full force.
        </li>
        <li>
          <strong>Entire Agreement:</strong> These T&amp;Cs, along with any policies referenced, constitute 
          the entire agreement between the parties relating to the subject matter.
        </li>
        <li>
          <strong>Contact Information:</strong> For questions or concerns, please contact us at 
          <a href="mailto:support@waterwaylabs.xyz" class="text-blue-600 hover:text-blue-800">
            support@waterwaylabs.xyz
          </a>.
        </li>
      </ol>
    
      <p class="mt-6">
        <strong>By accessing or using FootballGod, you acknowledge that you have read, understood, and agree 
        to be bound by these Terms and Conditions.</strong>
      </p>
      <div class="flex flex-row items-center my-4">
          <button class="brand-button" on:click={agreeTerms}>Agree Terms</button>
      </div>
  </div>
{/if}