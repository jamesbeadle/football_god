import { writable } from "svelte/store";
import type { PlayerDTO, LeagueId } from "../../../../declarations/data_canister/data_canister.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  const { subscribe, set } = writable<PlayerDTO[]>([]);

  async function getPlayers(leagueId: LeagueId) {
    return new PlayerService().getPlayers(leagueId);
  }

  async function getLoanedPlayers(leagueId: LeagueId) {
    return new PlayerService().getLoanedPlayers(leagueId);
  }

  return {
    subscribe,
    setPlayers: (players: PlayerDTO[]) => set(players),
    getPlayers,
    getLoanedPlayers,
  };
}

export const playerStore = createPlayerStore();
