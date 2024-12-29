// src/lib/stores/bet-slip-store.ts
import { writable } from "svelte/store";
import { browser } from "$app/environment";

export interface SimpleSelectedBet {
  fixtureId: number;
  description: string;
  odds: number;
}

const STORAGE_KEY = "global-selected-bets";

function loadInitial(): SimpleSelectedBet[] {
  if (!browser) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const initial = loadInitial();
const selectedBets = writable<SimpleSelectedBet[]>(initial);

// persist in localStorage whenever changed
selectedBets.subscribe((value) => {
  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }
});

function addBet(bet: SimpleSelectedBet) {
  selectedBets.update((current) => {
    const exists = current.some(
      (b) =>
        b.fixtureId === bet.fixtureId &&
        b.description === bet.description &&
        b.odds === bet.odds,
    );
    return exists ? current : [...current, bet];
  });
}

function removeBet(bet: SimpleSelectedBet) {
  selectedBets.update((current) =>
    current.filter(
      (b) =>
        !(
          b.fixtureId === bet.fixtureId &&
          b.description === bet.description &&
          b.odds === bet.odds
        ),
    ),
  );
}

/**
 * Synchronous check if a bet is in the store.
 * Called from the UI to highlight if the user has selected it.
 */
function isSelected(fixtureId: number, description: string, odds: number) {
  let found = false;
  // We "subscribe" and immediately unsubscribe to get the current value
  selectedBets.subscribe((current) => {
    found = current.some(
      (b) =>
        b.fixtureId === fixtureId &&
        b.description === description &&
        b.odds === odds,
    );
  })();
  return found;
}

export const betSlipStore = {
  subscribe: selectedBets.subscribe,
  addBet,
  removeBet,
  isSelected,
};
