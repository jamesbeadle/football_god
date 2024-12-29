import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type {
  Category,
  Selection,
  SelectionDetail,
} from "../../../../declarations/data_canister/data_canister.did";
import { replacer } from "$lib/utils/helpers";
import type { ExtendedSelection } from "$lib/types/extended-selection";

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
const selectedBetsStore = writable<ExtendedSelection[]>(initial);

selectedBetsStore.subscribe((value) => {
  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value, replacer));
  }
});

function addBet(bet: ExtendedSelection) {
  selectedBetsStore.update((current) => {
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

function removeBet(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
) {
  selectedBetsStore.update((current) =>
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

function isSelected(
  leagueId: number,
  fixtureId: number,
  category: Category,
  detail: SelectionDetail,
) {
  let found = false;
  selectedBetsStore.subscribe((current) => {
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
  subscribe: selectedBetsStore.subscribe,
  addBet,
  removeBet,
  isSelected,
};
