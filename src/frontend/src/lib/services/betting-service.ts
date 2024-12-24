import type {
  FixtureId,
  HomePageFixtureDTO,
  LeagueId,
  MatchOddsDTO,
} from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "$lib/utils/helpers";

export class BettingService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getLeagueFixtures(leagueId: LeagueId): Promise<HomePageFixtureDTO[]> {
    const result = await this.actor.getLeagueFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league fixtures");
    return result;
  }

  async getMatchOdds(
    leagueId: LeagueId,
    fixtureId: FixtureId,
  ): Promise<MatchOddsDTO> {
    let result = await this.actor.getMatchOdds(leagueId, fixtureId);
    if (isError(result)) throw new Error("Failed to fetch match odds");
    return result.ok;
  }
}
