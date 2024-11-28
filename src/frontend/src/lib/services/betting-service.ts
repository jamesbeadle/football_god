import type {
  HomePageFixtureDTO,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";

export class BettingService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getLeagueFixtures(leagueId: LeagueId): Promise<HomePageFixtureDTO[]> {
    return await this.actor.getLeagueFixtures(leagueId);
  }
}
