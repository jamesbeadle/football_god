import type { LeagueId } from "../../../../declarations/backend/backend.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  async function getPlayers(leagueId: LeagueId) {
    console.log("calling service to get players");
    console.log(`league id is ${leagueId}`);
    return new PlayerService().getPlayers(leagueId);
  }

  return {
    getPlayers,
  };
}

export const playerStore = createPlayerStore();
