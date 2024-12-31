import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { replacer } from "$lib/utils/helpers";
import type { ExtendedSelection } from "$lib/types/extended-selection";
import type {
  Category,
  SelectionDetail,
} from "../../../../declarations/data_canister/data_canister.did";

const STORAGE_KEY = "global-selected-bets";

function loadInitial(): ExtendedSelection[] {
  if (!browser) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function detailEquals(d1: SelectionDetail, d2: SelectionDetail): boolean {
  return JSON.stringify(d1, replacer) === JSON.stringify(d2, replacer);
}

function categoryEquals(c1: Category, c2: Category): boolean {
  return JSON.stringify(c1, replacer) === JSON.stringify(c2, replacer);
}

const initial = loadInitial();
const _betSlipStore = writable<ExtendedSelection[]>(initial);

_betSlipStore.subscribe((value) => {
  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value, replacer));
  }
});

export function addBet(bet: ExtendedSelection) {
  _betSlipStore.update((current) => {
    const exists = current.some(
      (b) =>
        b.leagueId === bet.leagueId &&
        b.fixtureId === bet.fixtureId &&
        categoryEquals(b.selectionType, bet.selectionType) &&
        detailEquals(b.selectionDetail, bet.selectionDetail),
    );
    return exists ? current : [...current, bet];
  });
}

export function removeBet(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
) {
  _betSlipStore.update((current) =>
    current.filter(
      (b) =>
        !(
          b.leagueId === leagueId &&
          b.fixtureId === fixtureId &&
          categoryEquals(b.selectionType, category) &&
          detailEquals(b.selectionDetail, detail)
        ),
    ),
  );
}

export function isSelected(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
) {
  let found = false;
  _betSlipStore.subscribe((current) => {
    found = current.some(
      (b) =>
        b.leagueId === leagueId &&
        b.fixtureId === fixtureId &&
        categoryEquals(b.selectionType, category) &&
        detailEquals(b.selectionDetail, detail),
    );
  })();
  return found;
}

export const betSlipStore = {
  subscribe: _betSlipStore.subscribe,
  addBet,
  removeBet,
  isSelected,
};
