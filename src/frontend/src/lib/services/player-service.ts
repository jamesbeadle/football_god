import type { LeagueId } from "../../../../declarations/backend/backend.did";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  LoanedPlayerDTO,
  PlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class PlayerService {
  constructor() {}

  async getPlayers(leagueId: LeagueId): Promise<PlayerDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );

    const result = await identityActor.getPlayers(leagueId);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }

  async getLoanedPlayers(leagueId: LeagueId): Promise<LoanedPlayerDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getLoanedPlayers(leagueId);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }
}
