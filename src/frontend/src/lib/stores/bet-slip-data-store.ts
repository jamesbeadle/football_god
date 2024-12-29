import { writable } from "svelte/store";
import { clubStore } from "$lib/stores/club-store";
import { playerStore } from "$lib/stores/player-store";

import type {
  LeagueId,
  PlayerDTO,
  ClubDTO,
} from "../../../../declarations/data_canister/data_canister.did";

interface BetSlipLeagueData {
  clubs: Record<number, ClubDTO>;
  players: Record<number, PlayerDTO>;
}

const dataStore = writable<Record<LeagueId, BetSlipLeagueData>>({});

async function ensureLeagueData(
  leagueId: LeagueId,
): Promise<BetSlipLeagueData> {
  let currentData: Record<LeagueId, BetSlipLeagueData>;
  dataStore.subscribe((val) => (currentData = val))();

  if (currentData![leagueId]) {
    return currentData![leagueId];
  }

  const clubsArr = await clubStore.getClubs(leagueId);
  const playersArr = await playerStore.getPlayers(leagueId);

  const clubsObj: Record<number, ClubDTO> = {};
  for (const c of clubsArr) clubsObj[c.id] = c;

  const playersObj: Record<number, PlayerDTO> = {};
  for (const p of playersArr) playersObj[p.id] = p;

  dataStore.update((old) => ({
    ...old,
    [leagueId]: { clubs: clubsObj, players: playersObj },
  }));

  return { clubs: clubsObj, players: playersObj };
}

export const betSlipDataStore = {
  subscribe: dataStore.subscribe,
  ensureLeagueData,
};
