import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class FixtureService {
  constructor() {}

  async getFixturesHash(leagueId: number): Promise<string> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getFixturesHash(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures hash");
    return result.ok;
  }

  async getPostponedFixtures(leagueId: number): Promise<FixtureDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getPostponedFixtures();
    if (isError(result)) throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }

  async getFixtures(leagueId: number): Promise<FixtureDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures");
    return result.ok;
  }
}
