import { writable } from "svelte/store";
import type {
  LeagueId,
  Players,
} from "../../../../declarations/backend/backend.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  const { subscribe, set } = writable<Players | undefined>(undefined);

  async function getPlayers(leagueId: LeagueId) {
    return new PlayerService().getPlayers(leagueId);
  }

  async function getLoanedPlayers(leagueId: LeagueId) {
    return new PlayerService().getLoanedPlayers(leagueId);
  }

  return {
    subscribe,
    setPlayers: (players: Players) => set(players),
    getPlayers,
    getLoanedPlayers,
  };
}

export const playerStore = createPlayerStore();
