import type {
  FixtureId,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { BettingService } from "../services/betting-service";

function createBettingStore() {
  async function getBettableHomepageFixtures(leagueId: LeagueId) {
    return new BettingService().getBettableHomepageFixtures(leagueId);
  }

  async function getMatchOdds(leagueId: LeagueId, fixtureId: FixtureId) {
    return new BettingService().getMatchOdds(leagueId, fixtureId);
  }

  return {
    getBettableHomepageFixtures,
    getMatchOdds,
  };
}

export const bettingStore = createBettingStore();
