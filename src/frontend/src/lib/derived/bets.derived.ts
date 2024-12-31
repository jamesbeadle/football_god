import { derived } from "svelte/store";
import { betSlipStore } from "$lib/stores/bet-slip-store";
import type { ExtendedSelection } from "$lib/types/extended-selection";
import type { BetType } from "../../../../declarations/backend/backend.did";

const possibleBetTypesByCount: Record<number, BetType[]> = {
  1: [],
  2: [{ Double: null }],
  3: [{ Treble: null }, { Trixie: null }, { Patent: null }],
  4: [{ FourFold: null }, { Yankee: null }, { Lucky15: null }],
  5: [{ FiveFold: null }, { Canadian: null }, { Lucky31: null }],
  6: [{ SixFold: null }, { Heinz: null }, { Lucky63: null }],
  7: [{ SevenFold: null }, { SuperHeinz: null }],
  8: [{ EightFold: null }, { Goliath: null }],
  9: [{ NineFold: null }],
  10: [{ TenFold: null }],
};

function getPossibleBetTypes(count: number): BetType[] {
  return possibleBetTypesByCount[count] || [];
}

export const availableMultiplesStore = derived(betSlipStore, ($state) => {
  const { bets } = $state;
  const count = bets.length;
  if (count === 0) {
    return [];
  }
  const uniqueFixtures = new Set(bets.map((b) => b.fixtureId));
  const allUnique = uniqueFixtures.size === count;

  if (!allUnique && count > 1) {
    return [];
  }

  return getPossibleBetTypes(count);
});

export function calculateMultipleOdds(bets: ExtendedSelection[]): number {
  return bets.reduce((acc, bet) => acc * bet.odds, 1);
}
