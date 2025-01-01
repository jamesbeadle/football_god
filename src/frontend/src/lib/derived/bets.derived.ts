import { derived } from "svelte/store";
import { betSlipStore } from "$lib/stores/bet-slip-store";
import type { ExtendedSelection } from "$lib/types/extended-selection";
import type { BetType } from "../../../../declarations/backend/backend.did";

const possibleBetTypesByCount: Record<number, BetType[]> = {
  1: [],
  2: [{ Double: null }],
  3: [
    {
      Treble: null,
    } /* //TODO ROMOVED ACCA ROLLUPS, { Trixie: null }, { Patent: null } */,
  ],
  4: [
    {
      FourFold: null,
    } /* //TODO ROMOVED ACCA ROLLUPS, { Yankee: null }, { Lucky15: null }*/,
  ],
  5: [
    {
      FiveFold: null,
    } /* //TODO ROMOVED ACCA ROLLUPS, { Canadian: null }, { Lucky31: null }*/,
  ],
  6: [
    {
      SixFold: null,
    } /* //TODO ROMOVED ACCA ROLLUPS, { Heinz: null }, { Lucky63: null }*/,
  ],
  7: [
    { SevenFold: null } /* //TODO ROMOVED ACCA ROLLUPS, { SuperHeinz: null }*/,
  ],
  8: [{ EightFold: null } /* //TODO ROMOVED ACCA ROLLUPS, { Goliath: null }*/],
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
  if (!bets || bets.length === 0) return 0;

  const finalDecimal = bets.reduce((acc, bet) => {
    return acc * (bet.odds + 1);
  }, 1);

  return finalDecimal - 1;
}

export function calculateMultipleOddsForType(
  bets: ExtendedSelection[],
  betType: BetType,
): number {
  if (!bets || bets.length === 0) return 0;
  if ("Double" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("Treble" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("FourFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("FiveFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("SixFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("SevenFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("EightFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("NineFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  } else if ("TenFold" in betType) {
    const finalDecimal = bets.reduce((acc, bet) => {
      const decimalOdds = bet.odds + 1;
      return acc * decimalOdds;
    }, 1);
    return finalDecimal - 1;
  }

  return 1;
}
