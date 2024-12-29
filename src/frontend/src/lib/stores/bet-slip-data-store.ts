import { get, writable } from "svelte/store";

import { clubStore } from "$lib/stores/club-store";
import { playerStore } from "$lib/stores/player-store";
import type {
  ClubDTO,
  LeagueId,
  PlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";

interface LeagueData {
  clubs: Record<number, ClubDTO>;
  players: Record<number, PlayerDTO>;
}

const dataStore = writable<Record<LeagueId, LeagueData>>({});

export async function ensureLeagueData(
  leagueId: LeagueId,
): Promise<LeagueData> {
  const current = get(dataStore);

  if (current[leagueId]) {
    return current[leagueId];
  }

  const clubsArr = await clubStore.getClubs(leagueId);
  const playersArr = await playerStore.getPlayers(leagueId);

  const clubsObj: Record<number, ClubDTO> = {};
  for (const c of clubsArr) {
    clubsObj[c.id] = c;
  }
  const playersObj: Record<number, PlayerDTO> = {};
  for (const p of playersArr) {
    playersObj[p.id] = p;
  }

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
