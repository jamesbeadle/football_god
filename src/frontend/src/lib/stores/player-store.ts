import { writable } from "svelte/store";
import type {
  GetLoanedPlayers,
  GetPlayers,
  LeagueId,
  Player,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  const { subscribe, set } = writable<Player[]>([]);

  async function getPlayers(dto: GetPlayers) {
    return new PlayerService().getPlayers(dto);
  }

  async function getLoanedPlayers(dto: GetLoanedPlayers) {
    return new PlayerService().getLoanedPlayers(dto);
  }

  return {
    subscribe,
    setPlayers: (players: Player[]) => set(players),
    getPlayers,
    getLoanedPlayers,
  };
}

export const playerStore = createPlayerStore();
