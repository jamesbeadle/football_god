import { writable } from "svelte/store";
import type {
  LeagueId,
  Player,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  const { subscribe, set } = writable<Player[]>([]);

  async function getPlayers(leagueId: LeagueId) {
    return new PlayerService().getPlayers(leagueId);
  }

  async function getLoanedPlayers(leagueId: LeagueId) {
    return new PlayerService().getLoanedPlayers(leagueId);
  }

  return {
    subscribe,
    setPlayers: (players: Player[]) => set(players),
    getPlayers,
    getLoanedPlayers,
  };
}

export const playerStore = createPlayerStore();
