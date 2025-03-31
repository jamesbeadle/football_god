import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  Club,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class ClubService {
  constructor() {}

  async getClubs(leagueId: LeagueId): Promise<Club[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );

    const result = await identityActor.getClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }
}
