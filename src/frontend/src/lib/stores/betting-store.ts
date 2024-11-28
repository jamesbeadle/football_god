import type { LeagueId } from "../../../../declarations/backend/backend.did";
import { BettingService } from "../services/betting-service";

function createBettingStore() {
  async function getLeagueFixtures(leagueId: LeagueId) {
    return new BettingService().getLeagueFixtures(leagueId);
  }

  return {
    getLeagueFixtures,
  };
}

export const bettingStore = createBettingStore();
