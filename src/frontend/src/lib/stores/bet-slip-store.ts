import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import { replacer } from "$lib/utils/helpers";
import { clubStore } from "./club-store";
import { leagueStore } from "./league-store";
import { fixtureStore } from "./fixture-store";
import { fixtureWithClubsStore } from "$lib/derived/fixtures-with-clubs.derived";

import type { ExtendedSelection } from "$lib/types/extended-selection";
import type {
  Category,
  SelectionDetail,
} from "../../../../declarations/data_canister/data_canister.did";
import type { ClubDTO } from "../../../../declarations/backend/backend.did";

export interface BetSlipState {
  bets: ExtendedSelection[];
  isMultiple: boolean;
  singleStakes: Record<number, number>;
  multipleStakes: Record<string, number>;
}

const STORAGE_KEY = "global-bet-slip-state";

async function loadFixtureData(leagueId: number, fixtureId: number) {
  try {
    // First try to get fixture with clubs from the derived store
    const fixtureWithClubs = get(fixtureWithClubsStore).find(f => f.id === fixtureId);
    if (fixtureWithClubs) {
      return {
        fixture: fixtureWithClubs,
        league: await leagueStore.getLeagueById(leagueId)
      };
    }

    // If not in derived store, get fixtures and clubs separately
    const fixtures = await fixtureStore.getFixtures(leagueId);
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (!fixture) return null;

    const clubs = await clubStore.getClubs(leagueId);
    const homeClub = clubs.find((c: ClubDTO) => c.id === fixture.homeClubId);
    const awayClub = clubs.find((c: ClubDTO) => c.id === fixture.awayClubId);

    return {
      fixture: {
        ...fixture,
        homeClub,
        awayClub
      },
      league: await leagueStore.getLeagueById(leagueId)
    };
  } catch (error) {
    console.error('Error loading fixture data:', error);
    return null;
  }
}

function loadInitial(): BetSlipState {
  if (!browser) {
    return {
      bets: [],
      isMultiple: false,
      singleStakes: {},
      multipleStakes: {},
    };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        bets: [],
        isMultiple: false,
        singleStakes: {},
        multipleStakes: {},
      };
    }
    const state = JSON.parse(stored) as BetSlipState;
    state.bets.forEach(async (bet) => {
      try {
        const fixtureData = await loadFixtureData(bet.leagueId, bet.fixtureId);
        if (fixtureData) {
          bet.fixtureDetails = `${fixtureData.fixture.homeClub?.name} v ${fixtureData.fixture.awayClub?.name}`;
          bet.leagueName = fixtureData.league?.name;
        }
      } catch (error) {
        console.error(`Error loading fixture data for bet:`, error);
      }
    });
    return state;
  } catch {
    return {
      bets: [],
      isMultiple: false,
      singleStakes: {},
      multipleStakes: {},
    };
  }
}

const initial = loadInitial();

const _betSlipStore = writable<BetSlipState>(initial);

_betSlipStore.subscribe((val) => {
  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val, replacer));
  }
});

export function addBet(bet: ExtendedSelection) {
  _betSlipStore.update((state) => {
    const exists = state.bets.some(
      (b) =>
        b.leagueId === bet.leagueId &&
        b.fixtureId === bet.fixtureId &&
        categoryEquals(b.selectionType, bet.selectionType) &&
        detailEquals(b.selectionDetail, bet.selectionDetail),
    );
    if (!exists) {
      state.bets = [...state.bets, bet];
    }
    return state;
  });
}

export function removeBet(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
) {
  _betSlipStore.update((state) => {
    const idx = state.bets.findIndex(
      (b) =>
        b.leagueId === leagueId &&
        b.fixtureId === fixtureId &&
        categoryEquals(b.selectionType, category) &&
        detailEquals(b.selectionDetail, detail),
    );

    if (idx === -1) return state;

    state.bets.splice(idx, 1);

    const oldStakes = { ...state.singleStakes };
    const newStakes: Record<number, number> = {};

    state.bets.forEach((_, newIndex) => {
      if (newIndex < idx) {
        newStakes[newIndex] = oldStakes[newIndex] ?? 0;
      } else {
        newStakes[newIndex] = oldStakes[newIndex + 1] ?? 0;
      }
    });

    state.singleStakes = newStakes;

    if (state.bets.length === 0) {
      state.isMultiple = false;
      state.multipleStakes = {};
    }

    if (state.bets.length < 2) {
      state.isMultiple = false;
      state.multipleStakes = {};
    }

    return state;
  });
}

export function isSelected(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
): boolean {
  const state = get(_betSlipStore);
  return state.bets.some(
    (b) =>
      b.leagueId === leagueId &&
      b.fixtureId === fixtureId &&
      categoryEquals(b.selectionType, category) &&
      detailEquals(b.selectionDetail, detail),
  );
}

export function setIsMultiple(value: boolean) {
  _betSlipStore.update((state) => {
    state.isMultiple = value;
    return state;
  });
}

export function setSingleStake(index: number, stake: number) {
  _betSlipStore.update((state) => {
    state.singleStakes[index] = stake;
    return state;
  });
}

export function setMultipleStake(multipleName: string, stake: number) {
  _betSlipStore.update((state) => {
    state.multipleStakes[multipleName] = stake;
    return state;
  });
}

export const betSlipStore = {
  subscribe: _betSlipStore.subscribe,
  addBet,
  removeBet,
  isSelected,
  setIsMultiple,
  setSingleStake,
  setMultipleStake,
};

function categoryEquals(c1: Category, c2: Category): boolean {
  return JSON.stringify(c1, replacer) === JSON.stringify(c2, replacer);
}

function detailEquals(d1: SelectionDetail, d2: SelectionDetail): boolean {
  return JSON.stringify(d1, replacer) === JSON.stringify(d2, replacer);
}
