<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import Layout from "../Layout.svelte";
  import FullScreenSpinner from "$lib/components/shared/full-screen-spinner.svelte";
  import BadgeIcon from "$lib/icons/BadgeIcon.svelte";
  import TableIcon from "$lib/icons/TableIcon.svelte";
  import OddsIcon from "$lib/icons/OddsIcon.svelte";
  import Betslip from "$lib/components/bettings/betslip.svelte";

  import { clubStore } from "$lib/stores/club-store";
  import { playerStore } from "$lib/stores/player-store";
  import { fixtureStore } from "$lib/stores/fixture-store";
  import { bettingStore } from "$lib/stores/betting-store";

  import { betSlipStore } from "$lib/stores/bet-slip-store";

  import { formatUnixDateToReadable, formatUnixTimeToTime } from "$lib/utils/helpers";

  import type { MatchOddsDTO } from "../../../../declarations/backend/backend.did"; 
  import type { Category, Selection, ClubDTO, FixtureDTO, PlayerDTO } from "../../../../declarations/data_canister/data_canister.did";

  let isLoading = true;
  let activeTab = "All";
  let yesSelected = false;
  let noSelected = false;

  // We'll no longer store "selectedOdds" in a local Record. Instead, we read from betSlipStore.

  $: leagueId = Number($page.url.searchParams.get("leagueId"));
  $: fixtureId = Number($page.url.searchParams.get("fixtureId"));

  let matchOdds: MatchOddsDTO | undefined;
  let players: PlayerDTO[] = [];
  let fixture: FixtureDTO | undefined;
  let homeClub: ClubDTO | undefined;
  let awayClub: ClubDTO | undefined;

  const tabs = ["All", "Goals", "Player", "Team", "Half Time"];
  let isBetSlipExpanded = false;

  onMount(async () => {
    try {
      matchOdds = await bettingStore.getMatchOdds(leagueId, fixtureId);
      players = await playerStore.getPlayers(leagueId);
      const clubs = await clubStore.getClubs(leagueId);
      const fixtures = await fixtureStore.getFixtures(leagueId);

      fixture = fixtures.find((x) => x.id === fixtureId);
      if (!fixture) return;

      homeClub = clubs.find((x) => x.id === fixture!.homeClubId);
      awayClub = clubs.find((x) => x.id === fixture!.awayClubId);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  });

  function toggleBetSlip() {
    isBetSlipExpanded = !isBetSlipExpanded;
  }

  // Example “categoryGroups” logic omitted...

  function isBetSelected(
    fixtureId: number,
    description: string,
    odds: number
  ) {
    return betSlipStore.isSelected(fixtureId, description, odds);
  }

  function toggleBetSelection(
    fixtureId: number,
    description: string,
    odds: number
  ) {
    if (isBetSelected(fixtureId, description, odds)) {
      betSlipStore.removeBet({ fixtureId, description, odds });
    } else {
      betSlipStore.addBet({ fixtureId, description, odds });
    }
  }
</script>

<Layout>
  <div class="flex flex-col md:flex-row">
    <div class="flex-1 md:block">
      {#if isLoading}
        <FullScreenSpinner />
      {:else}
        <div class="flex flex-col p-4 space-y-4 text-white rounded-xl bg-BrandGray">
          <!-- fixture header, etc. -->

          <!-- your categories tabs / logic, etc. -->
          <div class="flex space-x-2 overflow-x-auto">
            {#each tabs as tab}
              <button
                class="
                  px-4 py-2 rounded-xl whitespace-nowrap
                  {activeTab === tab
                    ? 'bg-BrandPurple text-white'
                    : 'bg-BrandGray border border-BrandOddsDivider text-gray-400 hover:bg-BrandGray/80'}"
                on:click={() => (activeTab = tab)}
              >
                {tab}
              </button>
            {/each}
          </div>

          <!-- Some mock example of an odds button -->
          <button
            class="
              mt-4
              {isBetSelected(fixtureId, 'Example Bet', 2.5)
                ? 'bg-purple-700'
                : 'bg-gray-600'
              }"
            on:click={() =>
              toggleBetSelection(fixtureId, 'Example Bet', 2.5)
            }
          >
            Example Bet @ 2.5
            {#if isBetSelected(fixtureId, 'Example Bet', 2.5)}
              SELECTED
            {/if}
          </button>

        </div>
      {/if}
    </div>

    <!-- BetSlip -->
    <div class="flex-shrink-0 lg:ml-4 lg:w-80">
      <div class="hidden lg:block lg:sticky lg:top-4">
        <Betslip />
      </div>
      <div
        class="
          fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl border-BrandOddsDivider bg-BrandGray lg:hidden
          {isBetSlipExpanded ? 'hidden' : ''}
          md:left-24 md:right-12
        "
      >
        <div class="w-full p-4 bg-white rounded-2xl md:mx-0">
          <button class="flex items-center w-full text-left" on:click={toggleBetSlip}>
            <div class="flex items-center">
              <span class="flex items-center justify-center w-12 h-10 mr-3 text-xl font-medium text-white rounded-full bg-BrandPurple">
                Bets
              </span>
              <span class="text-xl font-semibold text-black">Bet Slip</span>
            </div>
          </button>
        </div>
      </div>
      {#if isBetSlipExpanded}
        <div class="lg:hidden">
          <Betslip bind:isExpanded={isBetSlipExpanded} />
        </div>
      {/if}
    </div>
  </div>
</Layout>
