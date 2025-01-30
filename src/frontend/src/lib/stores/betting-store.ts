import type {
  FixtureId,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { BettingService } from "../services/betting-service";
import { dev } from '$app/environment';
import { mockData } from "../local/mock-data";

function createBettingStore() {
  async function getBettableHomepageFixtures(leagueId: LeagueId) {
    if (dev) {
      const bettableFixturesData = mockData.bettableFixtures[leagueId];
      return bettableFixturesData?.ok;
    }
    return new BettingService().getBettableHomepageFixtures(leagueId);
  }

  async function getMatchOdds(leagueId: LeagueId, fixtureId: FixtureId) {
    if (dev) {
      const matchOddsData = mockData.matchOdds[leagueId][fixtureId];
      return matchOddsData?.ok;
    }
    return new BettingService().getMatchOdds(leagueId, fixtureId);
  }

  return {
    getBettableHomepageFixtures,
    getMatchOdds,
  };
}

export const bettingStore = createBettingStore();
