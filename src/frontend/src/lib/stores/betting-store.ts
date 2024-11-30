import type {
  FixtureId,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { BettingService } from "../services/betting-service";

function createBettingStore() {
  async function getLeagueFixtures(leagueId: LeagueId) {
    return new BettingService().getLeagueFixtures(leagueId);
  }

  async function getMatchOdds(leagueId: LeagueId, fixtureId: FixtureId) {
    return new BettingService().getMatchOdds(leagueId, fixtureId);
  }

  return {
    getLeagueFixtures,
    getMatchOdds,
  };
}

export const bettingStore = createBettingStore();
