import type {
  FixtureId,
  HomePageFixtureDTO,
  LeagueId,
  SubmitBetslipDTO,
} from "../../../../declarations/backend/backend.did";
import { BettingService } from "../services/betting-service";

function createBettingStore() {
  async function getBettableHomepageFixtures(
    leagueId: LeagueId,
  ): Promise<HomePageFixtureDTO[]> {
    return new BettingService().getBettableHomepageFixtures(leagueId);
  }

  async function getMatchOdds(leagueId: LeagueId, fixtureId: FixtureId) {
    return new BettingService().getMatchOdds(leagueId, fixtureId);
  }

  async function placeBet(dto: SubmitBetslipDTO): Promise<void> {
    return new BettingService().placeBet(dto);
  }

  return {
    getBettableHomepageFixtures,
    getMatchOdds,
    placeBet,
  };
}

export const bettingStore = createBettingStore();
