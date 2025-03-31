import { authStore } from "../stores/auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  League,
  LeagueStatus,
} from "../../../../declarations/data_canister/data_canister.did";

export class LeagueService {
  constructor() {}

  async getLeagues(): Promise<League[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getLeagues();
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async getLeagueStatus(leagueId: number): Promise<LeagueStatus> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getLeagueStatus(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league status");
    return result.ok;
  }
}
