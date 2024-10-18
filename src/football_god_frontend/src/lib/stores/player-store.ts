import type { LeagueId } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { PlayerService } from "$lib/services/player-service";

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
