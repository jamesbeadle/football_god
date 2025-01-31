import type {
  FixtureId,
  HomePageFixtureDTO,
  LeagueId,
  MatchOddsDTO,
} from "../../../../declarations/backend/backend.did";
import { isError } from "$lib/utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import { ActorFactory } from "$lib/utils/ActorFactory";

export class BettingService {
  constructor() {}

  async getBettableHomepageFixtures(
    leagueId: LeagueId,
  ): Promise<HomePageFixtureDTO[]> {
    const identityActor: any = await ActorFactory.createBackendIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result = await identityActor.getBettableHomepageFixtures(leagueId);
    if (isError(result))
      throw new Error("Failed to fetch bettable league fixtures");
    return result.ok;
  }

  async getMatchOdds(
    leagueId: LeagueId,
    fixtureId: FixtureId,
  ): Promise<MatchOddsDTO> {
    const identityActor: any = await ActorFactory.createBackendIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result = await identityActor.getMatchOdds(leagueId, fixtureId);
    if (isError(result)) throw new Error("Failed to fetch match odds");
    return result.ok;
  }
}
