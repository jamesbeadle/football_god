import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type { Fixture } from "../../../../declarations/data_canister/data_canister.did";

export class FixtureService {
  constructor() {}

  async getFixturesHash(leagueId: number): Promise<string> {
    const identityActor: any =
      await ActorFactory.createIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
    const result = await identityActor.getFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures hash");
    return result.ok;
  }

  async getPostponedFixtures(leagueId: number): Promise<Fixture[]> {
    const identityActor: any =
      await ActorFactory.createIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
    const result = await identityActor.getPostponedFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }

  async getFixtures(leagueId: number, seasonId: number): Promise<Fixture[]> {
    const identityActor: any =
      await ActorFactory.createIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
    const result = await identityActor.getFixtures(leagueId, seasonId);
    if (isError(result)) throw new Error("Failed to fetch fixtures");
    return result.ok;
  }
}
