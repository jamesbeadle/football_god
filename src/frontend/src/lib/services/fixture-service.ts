import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type { Fixture, GetFixtures, GetPostponedFixtures, PostponedFixtures, PostponeFixture } from "../../../../declarations/data_canister/data_canister.did";

export class FixtureService {
  constructor() {}

  async getPostponedFixtures(leagueId: number): Promise<Fixture[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetPostponedFixtures = {
      leagueId
    }
    const result = await identityActor.getPostponedFixtures(dto);
    if (isError(result)) throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }

  async getFixtures(leagueId: number, seasonId: number): Promise<Fixture[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetFixtures = {
      leagueId, seasonId
    }
    const result = await identityActor.getFixtures(dto);
    if (isError(result)) throw new Error("Failed to fetch fixtures");
    return result.ok;
  }
}
